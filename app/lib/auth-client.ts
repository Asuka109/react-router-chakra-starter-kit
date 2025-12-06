import { createAuthClient } from 'better-auth/react';
import { getStaticEnvironment } from '~/utils/environment';

export const authClient = createAuthClient({
  baseURL: getStaticEnvironment().AUTH_BASE_URL,
});
