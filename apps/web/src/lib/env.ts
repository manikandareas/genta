import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod/v4'

export const env = createEnv({
  /**
   * Server-side environment variables schema
   * These are only available on the server
   */
  server: {
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    // Add your server-side env vars here
    // DATABASE_URL: z.string().url(),
    // API_SECRET: z.string().min(1),
  },

  /**
   * Client-side environment variables schema
   * These are exposed to the client (must have VITE_ prefix)
   */
  clientPrefix: 'VITE_',
  client: {
    // Add your client-side env vars here
    VITE_API_URL: z.url(),
    // VITE_APP_NAME: z.string().min(1),
  },

  /**
   * Runtime environment - use import.meta.env for Vite
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    // Map your env vars here
    // DATABASE_URL: process.env.DATABASE_URL,
    VITE_API_URL: import.meta.env.VITE_API_URL,
  },

  /**
   * Treat empty strings as undefined
   */
  emptyStringAsUndefined: true,

  /**
   * Skip validation in certain environments (e.g., during build)
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
