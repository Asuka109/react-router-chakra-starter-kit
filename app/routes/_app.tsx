import { ThemeProvider } from 'next-themes';
import { Outlet } from 'react-router';
import { ChakraProvider } from '../components/chakra-provider';

export default function Layout() {
  return (
    <ChakraProvider>
      <ThemeProvider disableTransitionOnChange attribute="class">
        <Outlet />
      </ThemeProvider>
    </ChakraProvider>
  );
}
