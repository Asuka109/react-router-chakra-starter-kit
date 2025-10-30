import { defaultSystem, ChakraProvider as Provider } from '@chakra-ui/react';

export const ChakraProvider = (props: { children: React.ReactNode }) => {
  return <Provider value={defaultSystem} {...props} />;
};
