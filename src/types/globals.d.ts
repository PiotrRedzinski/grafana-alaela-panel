/**
 * Global build-time constants
 * These are defined by webpack.DefinePlugin during build
 */

declare const __DEV__: boolean;

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
  }
}

