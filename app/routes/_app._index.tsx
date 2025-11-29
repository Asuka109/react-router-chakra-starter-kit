import {
  Box,
  Button,
  Checkbox,
  ClientOnly,
  Heading,
  HStack,
  Progress,
  RadioGroup,
  Skeleton,
  VStack,
} from '@chakra-ui/react';
import { useAuth } from '../components/auth-provider';
import { ColorModeToggle } from '../components/color-mode-toggle';
import { SignInButton } from '../components/sign-in-button';
import { UserProfile } from '../components/user-profile';
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
  const { user, isLoading } = useAuth();

  return (
    <Box textAlign="center" fontSize="xl" pt="30vh">
      <VStack gap="8">
        <img alt="chakra logo" src="/static/logo.svg" width="80" height="80" />
        <Heading size="2xl" letterSpacing="tight">
          Welcome to React Router Chakra Starter Kit
        </Heading>

        {isLoading ? (
          <Skeleton w="160px" h="50px" rounded="md" />
        ) : user ? (
          <UserProfile />
        ) : (
          <SignInButton />
        )}

        <HStack gap="10">
          <Checkbox.Root defaultChecked>
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label>Checkbox</Checkbox.Label>
          </Checkbox.Root>

          <RadioGroup.Root display="inline-flex" defaultValue="1">
            <RadioGroup.Item value="1" mr="2">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemControl>
                <RadioGroup.ItemIndicator />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemText lineHeight="1">Radio</RadioGroup.ItemText>
            </RadioGroup.Item>

            <RadioGroup.Item value="2">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemControl>
                <RadioGroup.ItemIndicator />
              </RadioGroup.ItemControl>
              <RadioGroup.ItemText lineHeight="1">Radio</RadioGroup.ItemText>
            </RadioGroup.Item>
          </RadioGroup.Root>
        </HStack>

        <Progress.Root width="300px" value={65} striped animated>
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>

        <HStack>
          <Button>Lets go</Button>
          <Button variant="outline">pnpm add @chakra-ui/react</Button>
        </HStack>
      </VStack>

      <Box pos="absolute" top="4" right="4">
        <ClientOnly fallback={<Skeleton w="10" h="10" rounded="md" />}>
          <ColorModeToggle />
        </ClientOnly>
      </Box>
    </Box>
  );
}
