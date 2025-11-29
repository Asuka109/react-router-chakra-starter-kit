import { Box, Code, Container, Heading, Text } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import type { Route } from './+types/root';
import { ChakraProvider } from './components/chakra-provider';
import { VConsoleProvider } from './components/vconsole-provider';
import { staticAssetsMiddleware } from './middleware/static-assets.server';

export const loader = async (args: Route.LoaderArgs) => {
  return data(null, {
    headers: { 'X-Router-Pattern': args.unstable_pattern },
  });
};

export const headers = ({ loaderHeaders }: Route.HeadersArgs) => loaderHeaders;

/**
 * Middleware chain for root route
 * Static assets middleware handles serving assets for subpath deployment
 */
export const middleware: Route.MiddlewareFunction[] = [staticAssetsMiddleware];

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

interface LayoutProps extends React.PropsWithChildren {}

export const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <VConsoleProvider>{children}</VConsoleProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <ChakraProvider>
      <ThemeProvider disableTransitionOnChange attribute="class">
        <Container as="main" maxW="container.xl" pt={16} px={4}>
          <Heading as="h1" size="2xl" mb={4}>
            {message}
          </Heading>
          <Text fontSize="lg" mb={4}>
            {details}
          </Text>
          {stack && (
            <Box
              as="pre"
              w="full"
              p={4}
              overflowX="auto"
              bg="gray.50"
              _dark={{ bg: 'gray.800' }}
              borderRadius="md"
            >
              <Code bg="none">{stack}</Code>
            </Box>
          )}
        </Container>
      </ThemeProvider>
    </ChakraProvider>
  );
}
