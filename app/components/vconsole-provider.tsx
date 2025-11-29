import { useEffect } from 'react';
import { isDevelopmentOrPreviewEnvironment } from '../lib/environment';

/**
 * VConsoleProvider component that conditionally loads and initializes VConsole
 * Only enabled in local development and preview deployments
 */
export function VConsoleProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Check if VConsole should be enabled
    if (!isDevelopmentOrPreviewEnvironment()) {
      return;
    }

    // Dynamically import VConsole to avoid including it in production bundle
    import('vconsole')
      .then((VConsoleModule) => {
        const VConsole = VConsoleModule.default;
        // Initialize VConsole
        const vConsole = new VConsole({
          theme: 'dark',
          defaultPlugins: ['system', 'network', 'element', 'storage'],
          maxLogNumber: 1000,
        });

        console.log(
          '[VConsole] Initialized for development/preview environment',
        );

        // Cleanup function to destroy VConsole when component unmounts
        return () => {
          vConsole.destroy();
        };
      })
      .catch((error) => {
        console.error('[VConsole] Failed to load:', error);
      });
  }, []);

  return <>{children}</>;
}
