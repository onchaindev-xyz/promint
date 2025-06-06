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
        user,
    } = useAuth();

    const address = user?.address;

    return (
        <header className="w-full px-6 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Promint — Web</h1>
                <div className="flex items-center gap-4">
                    {/* 1. Wallet connecté mais non signé : modale obligatoire */}
                    {isWalletConnected && !isWalletSigned && address && (
                        <SignWalletModal
                            address={address}
                            onSigned={() => {/* La session NextAuth se recharge automatiquement */ }}
                            onError={() => {/* La modale reste ouverte (feedback dans le composant) */ }}
                        />
                    )}

                    {/* 2. Wallet connecté ET signé */}
                    {isWalletAuthenticated && address && (
                        <>
                            <span className="text-sm text-gray-700 truncate max-w-[140px]">{address}</span>
                            <LogoutButton mode="web" />
                        </>
                    )}

                    {/* 3. Non connecté (aucun wallet ou signature NextAuth) */}
                    {!isWalletConnected && <LoginWallet />}
                </div>
            </div>
        </header>
    );
}
