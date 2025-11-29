import { ThemeProvider } from 'next-themes';
import { Outlet } from 'react-router';
import { AuthProvider } from '../components/auth-provider';
import { ChakraProvider } from '../components/chakra-provider';

export default function Layout() {
  return (
    <ChakraProvider>
      <ThemeProvider disableTransitionOnChange attribute="class">
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
