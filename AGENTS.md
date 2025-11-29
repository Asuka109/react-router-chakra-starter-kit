# Project Guidelines for AI Agents

## Language Requirements

**All project content MUST be in English:**

- ✅ Code comments
- ✅ Documentation files
- ✅ GitHub Actions workflow names and steps
- ✅ Commit messages
- ✅ Pull request titles and descriptions
- ✅ Issue titles and descriptions
- ✅ README and other markdown files
- ✅ Configuration file comments

**AI Agent Conversations:**

- ℹ️ AI agents may communicate with users in their preferred language
- ℹ️ All code, documentation, and commits generated must still be in English
- ℹ️ Explanations and discussions can be in any language the user prefers

## Commit Message Standards

**All commit messages MUST follow [Conventional Commits](https://www.conventionalcommits.org/) specification:**

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `build`: Changes to build system or dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

### Examples

```bash
# Good examples
feat: add user authentication
fix: resolve memory leak in data processing
docs: update API documentation
feat(api): add new endpoint for user profiles
fix(auth)!: change token validation logic

# Breaking change
feat!: drop support for Node.js 12

# With body and footer
fix: prevent racing condition in order processing

Add mutex lock to ensure order consistency when
multiple requests arrive simultaneously.

Closes #123
```

### Rules

1. **Type is required** and must be lowercase
2. **Description is required** and must be lowercase (except proper nouns)
3. **No period** at the end of description
4. Use **imperative mood** ("add" not "added" or "adds")
5. **Breaking changes** must be indicated with `!` after type/scope or in footer with `BREAKING CHANGE:`
6. Keep first line **under 72 characters**
7. **Body and footer are optional** but recommended for complex changes

## Code Style

- Use **meaningful variable and function names** in English
- Write **clear and concise comments** explaining "why", not "what"
- Follow existing code style and patterns in the project
- Use **ES6+ features** where appropriate
- **Prefer early returns** to avoid deeply nested conditional branches

### Early Return Pattern

Use early returns (guard clauses) to handle error cases and edge conditions first, keeping the happy path at the lowest indentation level.

**❌ Bad - Deeply nested conditionals:**

```typescript
function processUser(user: User | null) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        if (user.emailVerified) {
          // Main logic deeply nested
          return performAction(user);
        } else {
          throw new Error("Email not verified");
        }
      } else {
        throw new Error("No permission");
      }
    } else {
      throw new Error("User not active");
    }
  } else {
    throw new Error("User not found");
  }
}
```

**✅ Good - Early returns:**

```typescript
function processUser(user: User | null) {
  if (!user) {
    throw new Error("User not found");
  }
  
  if (!user.isActive) {
    throw new Error("User not active");
  }
  
  if (!user.hasPermission) {
    throw new Error("No permission");
  }
  
  if (!user.emailVerified) {
    throw new Error("Email not verified");
  }
  
  // Main logic at the lowest indentation level
  return performAction(user);
}
```

**Benefits:**
- Reduces cognitive complexity
- Makes code more readable and maintainable
- Keeps the happy path clearly visible
- Easier to test individual conditions

### React useEffect Guidelines

**Use `useEffect` sparingly** as it adds cognitive overhead and dependency tracking complexity. Prefer moving logic into event handlers that trigger the side effects.

**❌ Bad - Unnecessary useEffect:**

```typescript
function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  // Adds cognitive overhead and dependency tracking
  useEffect(() => {
    if (query) {
      searchAPI(query).then(setResults);
    }
  }, [query]);
  
  return (
    <input 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
```

**✅ Good - Direct event handler:**

```typescript
function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value) {
      const data = await searchAPI(value);
      setResults(data);
    }
  };
  
  return (
    <input 
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
```

**When useEffect IS appropriate:**
- Synchronizing with external systems (WebSocket connections, browser APIs)
- Setting up subscriptions that need cleanup
- Fetching data on component mount (though consider React Query or similar)
- Responding to prop changes from parent components when no event exists

**Key principles:**
- If user action triggers the logic, use an event handler
- If parent component change triggers the logic, consider if parent should handle it
- Only use `useEffect` when truly synchronizing with external systems
- Always question if `useEffect` is necessary before adding it

### useMemo and useCallback Guidelines

**Use `useMemo` and `useCallback` sparingly** - only when computation costs are genuinely high. Prefer direct computation or moving logic into closures.

**❌ Bad - Premature optimization:**

```typescript
function UserProfile({ user }: Props) {
  // Unnecessary memoization for simple string formatting
  const displayName = useMemo(
    () => `${user.firstName} ${user.lastName}`,
    [user.firstName, user.lastName]
  );
  
  // Unnecessary callback memoization
  const handleClick = useCallback(() => {
    console.log('Clicked:', user.id);
  }, [user.id]);
  
  return (
    <div onClick={handleClick}>
      {displayName}
    </div>
  );
}
```

**✅ Good - Direct computation:**

```typescript
function UserProfile({ user }: Props) {
  // Simple computation - no memoization needed
  const displayName = `${user.firstName} ${user.lastName}`;
  
  // Direct function - no callback memoization needed
  const handleClick = () => {
    console.log('Clicked:', user.id);
  };
  
  return (
    <div onClick={handleClick}>
      {displayName}
    </div>
  );
}
```

**✅ Good - Computation inside closure when needed:**

```typescript
function DataTable({ items }: Props) {
  return (
    <table>
      {items.map(item => (
        <Row
          key={item.id}
          // Compute directly in callback - no memoization needed
          onClick={() => {
            const metadata = processItemData(item);
            handleRowClick(item.id, metadata);
          }}
        />
      ))}
    </table>
  );
}
```

**When memoization IS appropriate:**
- Expensive calculations (complex data transformations, heavy computations)
- Preventing unnecessary re-renders of memoized child components (`React.memo`)
- Referential equality matters for dependency arrays
- Profiling shows actual performance issues

**Key principles:**
- Memoization itself has overhead - don't use it prematurely
- Most computations are fast enough without memoization
- Measure performance before optimizing
- Prefer simple, readable code over premature optimization
- Remember: "Premature optimization is the root of all evil"

## Documentation

- Keep documentation **up-to-date** with code changes
- Use **clear and simple** language
- Include **examples** where helpful
- Add **troubleshooting sections** for common issues

## Pull Requests

- Use **descriptive titles** following Conventional Commits format
- Include **summary of changes** in description
- Reference **related issues** using `Closes #123` or `Fixes #456`
- Add **test plan** or verification steps
- Request **reviews** from appropriate team members

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Setup Guide](./.github/SETUP.md)
- [Troubleshooting Guide](./.github/TROUBLESHOOTING.md)

---

**Note**: These guidelines apply to all contributions, whether made by humans or AI agents.
