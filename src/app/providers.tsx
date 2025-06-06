// ✅ Chemin complet : /src/app/providers.tsx
"use client";

import dynamic from "next/dynamic";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { FrameProvider } from "~/components/providers/FrameProvider";
import { SafeFarcasterSolanaProvider } from "~/components/providers/SafeFarcasterSolanaProvider";
import { CustomOnchainKitProvider } from "~/components/providers/OnchainKitProvider";

const WagmiProvider = dynamic(() => import("~/components/providers/WagmiProvider"), {
  ssr: false,
});

export function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const solanaEndpoint = process.env.SOLANA_RPC_ENDPOINT || "https://solana-rpc.publicnode.com";

  return (
    <SessionProvider session={session}>
      <WagmiProvider>
        <FrameProvider>
          <CustomOnchainKitProvider>
            <SafeFarcasterSolanaProvider endpoint={solanaEndpoint}>
              {children}
            </SafeFarcasterSolanaProvider>
          </CustomOnchainKitProvider>
        </FrameProvider>
      </WagmiProvider>
    </SessionProvider>
  );
}
