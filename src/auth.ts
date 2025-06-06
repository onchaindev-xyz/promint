// ✅ Chemin complet : /src/auth.ts

import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { verifyMessage } from "viem";

declare module "next-auth" {
  interface Session {
    user: {
      fid?: number;
      address?: string;
    };
  }
}

function getDomainFromUrl(urlString: string | undefined): string {
  if (!urlString) {
    return "localhost:3000";
  }
  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch (error) {
    return "localhost:3000";
  }
}

export const authOptions: AuthOptions = {
  providers: [
    // --- Provider Farcaster ---
    CredentialsProvider({
      id: "farcaster",
      name: "Sign in with Farcaster",
      credentials: {
        message: { label: "Message", type: "text", placeholder: "0x0" },
        signature: { label: "Signature", type: "text", placeholder: "0x0" },
      },
      async authorize(credentials, req) {
        const csrfToken = req?.body?.csrfToken;
        if (!csrfToken) return null;
        if (!credentials?.message || !credentials?.signature) return null;

        const appClient = createAppClient({ ethereum: viemConnector() });

        const domain = "pro.specuverse.xyz"; // À ADAPTER SI BESOIN

        const verifyResponse = await appClient.verifySignInMessage({
          message: credentials.message as string,
          signature: credentials.signature as `0x${string}`,
          domain,
          nonce: csrfToken,
        });

        const { success, fid } = verifyResponse;
        if (!success) return null;

        return {
          id: fid.toString(),
          fid,
          __provider: "farcaster" as const,
        };
      },
    }),
    // --- Provider Wallet ---
    CredentialsProvider({
      id: "wallet",
      name: "Sign in with Wallet",
      credentials: {
        message: { label: "Message", type: "text", placeholder: "0x0" },
        signature: { label: "Signature", type: "text", placeholder: "0x0" },
        address: { label: "Address", type: "text", placeholder: "0x0" },
      },
      async authorize(credentials, req) {
        const csrfToken = req?.body?.csrfToken;
        if (!credentials?.message || !credentials?.signature || !credentials?.address) {
          return null;
        }
        if (!csrfToken) return null;

        // Vérification stricte du nonce dans le message SIWW
        // Le message doit contenir "Nonce: <csrfToken>"
        const nonceRegex = /^Nonce: (.+)$/m;
        const match = credentials.message.match(nonceRegex);
        if (!match || match[1] !== csrfToken) {
          // Nonce absent ou mismatch => rejet immédiat
          return null;
        }

        try {
          // Validation cryptographique signature (cf. viem doc)
          const valid = await verifyMessage({
            address: credentials.address as `0x${string}`,
            message: credentials.message,
            signature: credentials.signature as `0x${string}`,
          });

          if (!valid) {
            return null;
          }

          // Identité validée, on retourne l'adresse comme user
          return {
            id: credentials.address.toLowerCase(),
            address: credentials.address.toLowerCase(),
            __provider: "wallet" as const,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        if (token?.__provider === "farcaster" && token.sub) {
          session.user.fid = parseInt(token.sub, 10);
          if ("address" in session.user) delete session.user.address;
        }
        if (token?.__provider === "wallet" && token.sub) {
          session.user.address = token.sub.toLowerCase();
          if ("fid" in session.user) delete session.user.fid;
        }
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user && "__provider" in user && (user as any).__provider) {
        token.__provider = (user as { __provider: "farcaster" | "wallet" }).__provider;
      }
      return token;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
};

export const getSession = async () => {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    return null;
  }
};
