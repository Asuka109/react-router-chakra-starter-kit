import {
  Box,
  Button,
  ClientOnly,
  Heading,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import debug from 'debug';
import { Link } from 'react-router';
import { withoutAssetsBase } from '~/constants';
import { ColorModeToggle } from '../components/color-mode-toggle';
import type { Route } from './+types/_app.$';

const log = debug('app:middleware:static-assets');

export const loader = async (args: Route.LoaderArgs) => {
  if (import.meta.env.DEV) return;
  const { request, context } = args;
  log('incoming request url:', request.url);
  const assetsBinding = context.cloudflare.env.ASSETS;

  // Only handle if ASSETS binding is available (production only)
  if (!assetsBinding) return;

  // Only handle static asset requests (paths with file extensions)
  const url = new URL(request.url);
  url.pathname = withoutAssetsBase(url.pathname);
  log('retrieving asset from:', url.href);
  const assetRequest = new Request(url, request);
  const assetResponse = await assetsBinding.fetch(assetRequest);

  log(
    'asset response content type:',
    assetResponse.headers.get('content-type'),
  );
  return assetResponse;
};

export const meta: Route.MetaFunction = () => {
  return [
    { title: '404 - Page Not Found' },
    { name: 'description', content: 'The requested page could not be found.' },
  ];
};

export default function NotFound() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
      bg="linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)"
    >
      {/* Background decorative elements */}
      <Box
        position="absolute"
        top="20%"
        left="10%"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="purple.500"
        opacity="0.1"
        filter="blur(100px)"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="10%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="cyan.500"
        opacity="0.1"
        filter="blur(120px)"
      />

      {/* Main content */}
      <VStack gap="6" textAlign="center" px="6" zIndex="1">
        {/* Glitchy 404 text effect */}
        <Box position="relative">
          <Heading
            as="h1"
            fontSize={{ base: '8rem', md: '12rem' }}
            fontWeight="900"
            letterSpacing="tight"
            color="transparent"
            bgGradient="linear(to-r, purple.400, cyan.400)"
            bgClip="text"
            lineHeight="1"
            textShadow="0 0 80px rgba(139, 92, 246, 0.5)"
          >
            404
          </Heading>
          <Heading
            as="span"
            position="absolute"
            top="0"
            left="0"
            fontSize={{ base: '8rem', md: '12rem' }}
            fontWeight="900"
            letterSpacing="tight"
            color="transparent"
            bgGradient="linear(to-r, cyan.400, purple.400)"
            bgClip="text"
            lineHeight="1"
            opacity="0.5"
            transform="translate(4px, 4px)"
            aria-hidden="true"
          >
            404
          </Heading>
        </Box>

        <VStack gap="3">
          <Heading
            as="h2"
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="600"
            color="gray.100"
          >
            Lost in the void
          </Heading>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="gray.400"
            maxW="400px"
          >
            The page you're looking for has drifted into the digital abyss.
            Let's get you back on track.
          </Text>
        </VStack>

        <Box pt="4">
          <Button
            asChild
            size="lg"
            bg="linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)"
            color="white"
            px="8"
            py="6"
            fontSize="md"
            fontWeight="600"
            borderRadius="full"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)',
            }}
            transition="all 0.2s ease"
          >
            <Link to="/">Return Home</Link>
          </Button>
        </Box>

        {/* Floating particles decoration */}
        <Box
          position="absolute"
          top="30%"
          left="20%"
          w="8px"
          h="8px"
          borderRadius="full"
          bg="purple.400"
          opacity="0.6"
          animation="float 3s ease-in-out infinite"
          css={{
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        />
        <Box
          position="absolute"
          top="60%"
          right="25%"
          w="6px"
          h="6px"
          borderRadius="full"
          bg="cyan.400"
          opacity="0.6"
          animation="float 4s ease-in-out infinite 1s"
          css={{
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        />
        <Box
          position="absolute"
          bottom="35%"
          left="30%"
          w="4px"
          h="4px"
          borderRadius="full"
          bg="pink.400"
          opacity="0.6"
          animation="float 3.5s ease-in-out infinite 0.5s"
          css={{
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        />
      </VStack>

      {/* Color mode toggle */}
      <Box pos="absolute" top="4" right="4">
        <ClientOnly fallback={<Skeleton w="10" h="10" rounded="md" />}>
          <ColorModeToggle />
        </ClientOnly>
      </Box>
    </Box>
  );
}
