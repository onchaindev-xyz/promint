// ✅ Chemin complet : /src/hooks/useAuth.ts

import { useSession, signOut } from "next-auth/react";
import { useAccount, useDisconnect } from "wagmi";

type ProviderType = "wallet" | "farcaster" | null;

export function useAuth() {
    const { data: session, status: sessionStatus } = useSession();
    const { isConnected: isWalletConnected, address } = useAccount();
    const { disconnect: disconnectWallet } = useDisconnect();

    // Provider détecté à partir de la session NextAuth
    const provider: ProviderType =
        session?.user?.fid ? "farcaster"
        : session?.user?.address ? "wallet"
        : null;

    const isWalletAuthenticated =
        !!address &&
        !!session?.user?.address &&
        address.toLowerCase() === session.user.address.toLowerCase();

    const isFarcasterAuthenticated = !!session?.user?.fid;

    // Auth globale : au moins un provider authentifié et session active
    const isAuthenticated = isWalletAuthenticated || isFarcasterAuthenticated;

    // Statut loading : session NextAuth ou wagmi pas encore prête
    const isLoading =
        sessionStatus === "loading" ||
        (isWalletConnected && !isWalletAuthenticated);

    // Logout centralisé
    const logout = async () => {
        if (isWalletConnected) disconnectWallet();
        await signOut({ redirect: false });
    };

    return {
        isAuthenticated,
        isWalletAuthenticated,
        isFarcasterAuthenticated,
        provider,
        user: session?.user ?? {},
        isLoading,
        logout,
        sessionStatus,
    } as const;
}
