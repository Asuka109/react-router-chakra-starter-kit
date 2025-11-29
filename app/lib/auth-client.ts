import { createAuthClient } from 'better-auth/react';
import { AUTH_BASE_URL } from '~/constants';

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
});
