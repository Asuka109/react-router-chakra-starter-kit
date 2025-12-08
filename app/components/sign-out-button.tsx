import { Button, type ButtonProps } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { authClient } from '~/lib/auth-client';

interface SignOutButtonProps extends Omit<ButtonProps, 'onClick'> {
  /**
   * The path to redirect to after sign out.
   * Defaults to '/' (home page).
   */
  redirectTo?: string;
}

export function SignOutButton({
  redirectTo = '/',
  children = 'Sign Out',
  ...buttonProps
}: SignOutButtonProps) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate(redirectTo);
        },
      },
    });
  };

  return (
    <Button
      onClick={handleSignOut}
      colorScheme="red"
      variant="outline"
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
