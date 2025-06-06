// ✅ Chemin complet : /src/components/providers/WagmiProvider.tsx

"use client";

import React, { useEffect, useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, degen, mainnet, optimism, unichain } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { coinbaseWallet, metaMask, walletConnect } from "wagmi/connectors";
import { useConnect, useAccount } from "wagmi";

import { APP_NAME, APP_ICON_URL, APP_URL } from "~/lib/constants";

const NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;

if (typeof window !== "undefined" && !NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.error("[WagmiProvider] Variable NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID manquante.");
}

// Hook d’auto-connexion pour Coinbase Wallet uniquement si environnement compatible
function useCoinbaseWalletAutoConnect(): boolean {
  const [isCoinbaseWallet, setIsCoinbaseWallet] = useState(false);
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    const checkCoinbaseWallet = () => {
      const isInCoinbaseWallet =
        window.ethereum?.isCoinbaseWallet ||
        window.ethereum?.isCoinbaseWalletExtension ||
        window.ethereum?.isCoinbaseWalletBrowser;

      setIsCoinbaseWallet(!!isInCoinbaseWallet);
    };

    checkCoinbaseWallet();
    window.addEventListener("ethereum#initialized", checkCoinbaseWallet);

    return () => {
      window.removeEventListener("ethereum#initialized", checkCoinbaseWallet);
    };
  }, []);

  useEffect(() => {
    if (isCoinbaseWallet && !isConnected) {
      const coinbaseConnector = connectors.find((c) => c.id === "coinbaseWallet");
      if (coinbaseConnector) {
        connect({ connector: coinbaseConnector });
      } else {
        console.error("Connector coinbaseWallet introuvable dans la liste des connecteurs wagmi.");
      }
    }
  }, [isCoinbaseWallet, isConnected, connect, connectors]);


  return isCoinbaseWallet;
}

// Configuration wagmi
export const config = createConfig({
  chains: [base, optimism, mainnet, degen, unichain],
  transports: {
    [base.id]: http(),
    [optimism.id]: http(),
    [mainnet.id]: http(),
    [degen.id]: http(),
    [unichain.id]: http(),
  },
  connectors: [
    farcasterFrame(),
    coinbaseWallet({
      appName: APP_NAME,
      appLogoUrl: APP_ICON_URL,
      preference: "eoaOnly",
    }),
    metaMask({
      dappMetadata: {
        name: APP_NAME,
        url: APP_URL,
      },
    }),
    walletConnect({
      projectId: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      metadata: {
        name: "Specuverse",
        description: `${APP_NAME} – Connexion sécurisée via WalletConnect`,
        url: "https://pro.specuverse.xyz",
        icons: [APP_ICON_URL],
      },
      showQrModal: true,
      qrModalOptions: {
        themeMode: "dark",
      },
      isNewChainsStale: true,
    }),
  ],
});

// Client pour react-query
const queryClient = new QueryClient();

// Wrapper qui active l’auto-connexion Coinbase si applicable
function CoinbaseWalletAutoConnect({ children }: { children: React.ReactNode }) {
  useCoinbaseWalletAutoConnect();
  return <>{children}</>;
}

// Fournisseur principal wagmi
export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CoinbaseWalletAutoConnect>{children}</CoinbaseWalletAutoConnect>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
