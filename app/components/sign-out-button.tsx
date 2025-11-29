import { Button } from '@chakra-ui/react';
import { authClient } from '~/lib/auth-client';

export function SignOutButton() {
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/';
        },
      },
    });
  };

  return (
    <Button onClick={handleSignOut} colorScheme="red" variant="outline">
      Sign Out
    </Button>
  );
}
