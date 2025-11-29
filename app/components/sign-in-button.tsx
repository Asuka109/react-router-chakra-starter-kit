import { Button } from '@chakra-ui/react';
import { authClient } from '~/lib/auth-client';

export function SignInButton() {
  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/',
    });
  };

  return (
    <Button onClick={handleSignIn} colorScheme="blue">
      Sign in with GitHub
    </Button>
  );
}
