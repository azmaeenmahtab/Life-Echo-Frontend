import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("life-echo-db");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      plan: {
        type: "string",
        required: false,
        input: false, // User can provide this during signup
      },
      role: {
        type: "string",
        required: false,
        input: false, // Internal-only, cannot be set during signup
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // This fires automatically during social or credential signups
        before: async (user) => {
          return {
            data: {
              ...user,
              role: "user", // Inject default role automatically
              plan: "free", // Inject default plan automatically
            },
          };
        },
      },
    },
  },
  plugins: [admin()],
});
