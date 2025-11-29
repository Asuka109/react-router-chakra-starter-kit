import { Avatar, HStack, Text, VStack } from '@chakra-ui/react';
import { useAuth } from './auth-provider';
import { SignOutButton } from './sign-out-button';

export function UserProfile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return null;
  }

  return (
    <HStack gap={4}>
      <Avatar.Root size="sm">
        <Avatar.Fallback name={user.name} />
        <Avatar.Image src={user.image || undefined} />
      </Avatar.Root>
      <VStack align="flex-start" gap={0}>
        <Text fontWeight="medium">{user.name}</Text>
        <Text fontSize="sm" color="gray.600">
          {user.email}
        </Text>
      </VStack>
      <SignOutButton />
    </HStack>
  );
}
