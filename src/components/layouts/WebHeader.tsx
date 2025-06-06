"use client";

import { useAuth } from "~/hooks/useAuth";
import LoginWallet from "../auth/LoginWallet";
import LogoutButton from "../auth/LogoutButton";
import SignWalletModal from "../auth/SignWalletModal";

export default function WebHeader() {
    const {
        isWalletAuthenticated: isWalletSigned,
        user,
        provider,
    } = useAuth();

    // Adresse actuelle si wallet (sinon undefined)
    const address = user?.address;

    return (
        <header className="w-full px-6 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Promint — Web</h1>
                <div className="flex items-center gap-4">
                    {/* 1. Connexion wagmi SANS signature NextAuth wallet -> modale obligatoire */}
                    {provider === "wallet" && !isWalletSigned && address && (
                        <SignWalletModal
                            address={address}
                            onSigned={() => { /* La session NextAuth se recharge automatiquement */ }}
                            onError={() => { /* Optionnel : feedback */ }}
                        />
                    )}

                    {/* 2. Connexion wagmi AVEC signature NextAuth wallet */}
                    {isWalletSigned && address && (
                        <>
                            <span className="text-sm text-gray-700 truncate max-w-[140px]">
                                {address}
                            </span>
                            <LogoutButton mode="web" />
                        </>
                    )}

                    {/* 3. Non connecté (ou signature non valide) */}
                    {!isWalletSigned && <LoginWallet />}
                </div>
            </div>
        </header>
    );
}
