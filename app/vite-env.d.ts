/** biome-ignore-all lint/correctness/noUnusedVariables: <explanation> */
/// <reference types="vite/client" />

/**
 * Vite environment variable types
 * These are set via .env files (local) or CI/CD (production)
 */
interface ImportMetaEnv {
  /**
   * Application base path for subpath deployment
   * @example "/" for root, "/gallery/my-app" for subpath
   */
  readonly VITE_APP_BASENAME: string;

  /**
   * Application domain
   * @example "localhost" for local dev, "example.com" for production
   */
  readonly VITE_APP_ORIGIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
