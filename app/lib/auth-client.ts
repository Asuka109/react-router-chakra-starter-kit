import { createAuthClient } from 'better-auth/react';
import { getEnvironment } from '~/utils/environment';

export const authClient = createAuthClient({
  baseURL: getEnvironment().AUTH_BASE_URL,
});
