// ✅ Chemin complet : src/components/providers/OnchainKitProvider.tsx

"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "viem/chains";
import React from "react";

interface Props {
    children: React.ReactNode;
}

// Chargement explicite des variables d’environnement accessibles côté client
const projectId = process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;

// Vérification stricte avec erreur explicite en environnement de développement
if (typeof window !== "undefined") {
    if (!projectId || !apiKey) {
        console.error("[OnchainKitProvider] projectId ou apiKey manquant dans le .env. Assurez-vous que NEXT_PUBLIC_COINBASE_PROJECT_ID et NEXT_PUBLIC_ONCHAINKIT_API_KEY sont correctement définis.");
    }
}

export function CustomOnchainKitProvider({ children }: Props) {
    return (
        <OnchainKitProvider
            chain={base}
            projectId={projectId ?? ""}
            apiKey={apiKey ?? ""}
            config={{
                appearance: {
                    name: "Specuverse",
                    logo: "/logo.png",
                    mode: "auto",
                    theme: "default",
                },
                wallet: {
                    display: "modal",
                    termsUrl: "https://web3.specuverse.xyz/terms",
                    privacyUrl: "https://web3.specuverse.xyz/privacy",
                },
            }}
        >
            {children}
        </OnchainKitProvider>
    );
}
