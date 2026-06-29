import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields(), // Automatically infers role and plan on client types
    adminClient(),
  ],
});

export const { signIn, signUp, useSession } = createAuthClient();
