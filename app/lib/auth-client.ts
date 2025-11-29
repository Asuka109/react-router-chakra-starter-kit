import { createAuthClient } from 'better-auth/react';
import { APP_BASE_URL } from '~/constants';

/**
 * Auth client configuration
 * Deployed to: https://asuk.app/gallery/react-router-chakra-starter-kit
 */
export const authClient = createAuthClient({
  baseURL: APP_BASE_URL,
});
