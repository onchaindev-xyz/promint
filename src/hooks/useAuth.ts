// ✅ Chemin complet : /src/hooks/useAuth.ts

import { useSession, signOut } from "next-auth/react";
import { useAccount, useDisconnect } from "wagmi";

type ProviderType = "wallet" | "farcaster" | null;

export function useAuth() {
    const { data: session, status: sessionStatus } = useSession();
    const { isConnected: isWalletConnected, address } = useAccount();
    const { disconnect: disconnectWallet } = useDisconnect();

    // Signature NextAuth = wallet signé (sinon, signature requise)
    const isWalletSigned =
        !!address &&
        !!session?.user?.address &&
        address.toLowerCase() === session.user.address.toLowerCase();

    // Farcaster signé = FID dans la session
    const isFarcasterSigned = !!session?.user?.fid;

    // Auth wallet = connecté wagmi ET signé NextAuth
    const isWalletAuthenticated = isWalletConnected && isWalletSigned;

    // Provider actif détecté
    const provider: ProviderType =
        isFarcasterSigned ? "farcaster"
        : isWalletSigned ? "wallet"
        : null;

    // Statut loading
    const isLoading =
        sessionStatus === "loading" ||
        (isWalletConnected && !isWalletSigned);

    // Logout global
    const logout = async () => {
        if (isWalletConnected) disconnectWallet();
        await signOut({ redirect: false });
    };

    return {
        isWalletConnected,    // wagmi pur
        isWalletSigned,       // NextAuth signature ok
        isWalletAuthenticated, // connecté ET signé
        isFarcasterSigned,    // Farcaster NextAuth
        provider,
        user: session?.user ?? {},
        isLoading,
        logout,
        sessionStatus,
    } as const;
}
