// ✅ Chemin complet : /src/hooks/useWalletAuth.ts
"use client";

import { useCallback } from "react";
import { signIn, getCsrfToken } from "next-auth/react";
import { useSignMessage } from "wagmi";

export function useWalletAuth() {
  const { signMessageAsync } = useSignMessage();

  const login = useCallback(
    async (address: string) => {
      if (!address) return;

      const csrfToken = await getCsrfToken();
      if (!csrfToken) {
        console.error("CSRF token introuvable.");
        return;
      }

      const message = `Sign in with wallet\n\nNonce: ${csrfToken}`;
      const signature = await signMessageAsync({ message });

      await signIn("wallet", {
        message,
        signature,
        address,
        redirect: false,
      });
    },
    [signMessageAsync]
  );

  return { login };
}
