// ✅ Chemin complet : /src/hooks/useAuth.ts

import { useSession, signOut } from "next-auth/react";
import { useAccount, useDisconnect } from "wagmi";

type ProviderType = "wallet" | "farcaster" | null;

export function useAuth() {
    // Données NextAuth
    const { data: session, status: sessionStatus } = useSession();

    // Données wagmi
    const { isConnected: isWalletConnected, address } = useAccount();
    const { disconnect: disconnectWallet } = useDisconnect();

    // Adresse du wallet connectée via wagmi
    // .user.address = adresse signée via NextAuth (signIn "wallet")
    // .user.fid = id Farcaster connecté

    // Session NextAuth signée côté wallet
    const isWalletSigned =
        !!session?.user?.address && !!address &&
        session.user.address.toLowerCase() === address.toLowerCase();

    // Wallet connecté ET session signée
    const isWalletAuthenticated = !!isWalletConnected && isWalletSigned;

    // Farcaster connecté (signature côté NextAuth)
    const isFarcasterSigned = !!session?.user?.fid;

    // Provider en cours (priorité wallet si double session)
    const provider: ProviderType =
        isWalletSigned ? "wallet"
        : isFarcasterSigned ? "farcaster"
        : null;

    // Méthode logout centralisée
    const logout = async () => {
        if (isWalletConnected) disconnectWallet();
        await signOut({ redirect: false });
    };

    // On expose TOUT ce qui est utile à l’UI, et rien d’autre
    return {
        isWalletConnected,         // wagmi connecté
        isWalletSigned,            // session NextAuth signée wallet
        isWalletAuthenticated,     // connecté + signé strict
        isFarcasterSigned,         // session NextAuth signée farcaster
        address,                   // adresse connectée (wagmi)
        fid: session?.user?.fid,   // fid Farcaster (si connecté)
        session: session ?? null,  // brute NextAuth
        sessionStatus,             // "loading" | "authenticated" | "unauthenticated"
        disconnectWallet,          // méthode wagmi (pour bouton custom)
        logout,                    // logout centralisé (déconnecte tout)
        provider,                  // "wallet" | "farcaster" | null
    } as const;
}
