import { env } from 'cloudflare:workers';
import { createAuth } from '~/lib/auth.server';
import type { Route } from './+types/api.auth.$';

export async function loader({ request }: Route.LoaderArgs) {
  const auth = createAuth(env.DB, env);
  return auth.handler(request);
}

export async function action({ request }: Route.ActionArgs) {
  const auth = createAuth(env.DB, env);
  return auth.handler(request);
}
