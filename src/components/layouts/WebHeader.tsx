// ✅ Chemin complet : /src/components/layout/WebHeader.tsx

"use client";

import { useAuth } from "~/hooks/useAuth";
import LoginWallet from "../auth/LoginWallet";
import LogoutButton from "../auth/LogoutButton";
import SignWalletModal from "../auth/SignWalletModal";

export default function WebHeader() {
    const {
        isWalletConnected,
        isWalletSigned,
        isWalletAuthenticated,
        address,
    } = useAuth();

    // 1. Wallet connecté mais PAS signé → modale obligatoire (on bloque toute l’UI tant que signature non faite)
    if (isWalletConnected && !isWalletSigned && address) {
        return (
            <SignWalletModal
                address={address}
                onSigned={() => {/* La session NextAuth va rafraîchir l’état automatiquement */ }}
                onError={() => {/* La modale reste ouverte, feedback géré dans SignWalletModal */ }}
            />
        );
    }

    // 2. Wallet connecté ET signé → affichage adresse + bouton logout
    if (isWalletAuthenticated && address) {
        return (
            <header className="w-full px-6 py-3 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Promint — Web</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700 truncate max-w-[140px]">
                            {address}
                        </span>
                        <LogoutButton mode="web" />
                    </div>
                </div>
            </header>
        );
    }

    // 3. Non connecté (ou non signé) → LoginWallet
    return (
        <header className="w-full px-6 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Promint — Web</h1>
                <div className="flex items-center gap-4">
                    <LoginWallet />
                </div>
            </div>
        </header>
    );
}
