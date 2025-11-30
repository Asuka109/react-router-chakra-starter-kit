import { HomePage } from '~/features/home-page';
import type { Route } from './+types/_app._index';

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'React Router Chakra Starter Kit' },
    {
      name: 'description',
      content: 'Welcome to React Router Chakra Starter Kit!',
    },
  ];
};

export default function Index() {
  return <HomePage />;
}
