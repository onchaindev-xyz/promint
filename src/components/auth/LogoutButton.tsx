// ✅ Chemin complet : /src/components/auth/LogoutButton.tsx
"use client";

import { useCallback } from "react";
import { useDisconnect } from "wagmi";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
    mode: "web" | "miniapp";
}

export default function LogoutButton({ }: LogoutButtonProps) {
    const { disconnectAsync } = useDisconnect();

    const handleLogout = useCallback(async () => {
        try {
            console.log("[LogoutButton] 🔻 Déconnexion du wallet...");
            await disconnectAsync();
            console.log("[LogoutButton] ✅ Wallet déconnecté");

            console.log("[LogoutButton] 🔻 Déconnexion NextAuth...");
            await signOut({ redirect: false });
            console.log("[LogoutButton] ✅ Session NextAuth terminée");
        } catch (err) {
            console.error("[LogoutButton] ❌ Erreur pendant la déconnexion :", err);
        }
    }, [disconnectAsync]);

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
            Se déconnecter
        </button>
    );
}
