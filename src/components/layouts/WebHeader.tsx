// /src/components/layout/WebHeader.tsx
"use client";

import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import LoginWallet from "../auth/LoginWallet";
import LogoutButton from "../auth/LogoutButton";
import SignWalletModal from "../auth/SignWalletModal";
import { useState, useCallback, useEffect } from "react";

export default function WebHeader() {
    const { isConnected, address } = useAccount();
    const { data: session } = useSession();
    // Pour affichage/masquage manuel de la modale sur signature réussie
    const [showSignModal, setShowSignModal] = useState(false);

    // Critère : signature validée uniquement si session NextAuth contient bien .user.address == address
    const isWalletSigned =
        !!address &&
        !!session?.user?.address &&
        session.user.address.toLowerCase() === address.toLowerCase();

    // Affichage/masquage automatique de la modale selon l'état
    useEffect(() => {
        if (isConnected && address && !isWalletSigned) {
            setShowSignModal(true);
        } else {
            setShowSignModal(false);
        }
    }, [isConnected, address, isWalletSigned]);

    // Callback succès = masquage modale (refresh UI automatique via NextAuth)
    const handleSignSuccess = useCallback(() => {
        setShowSignModal(false);
    }, []);

    // Callback erreur = la modale reste ouverte (pas de fermeture possible)
    const handleSignError = useCallback(() => {
        setShowSignModal(true);
    }, []);

    return (
        <header className="w-full px-6 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Promint — Web</h1>
                <div className="flex items-center gap-4">
                    {/* 1. Connexion wagmi SANS signature NextAuth wallet -> modale obligatoire */}
                    {isConnected && address && !isWalletSigned && showSignModal && (
                        <SignWalletModal
                            address={address}
                            onSigned={handleSignSuccess}
                            onError={handleSignError}
                        />
                    )}

                    {/* 2. Connexion wagmi AVEC signature NextAuth wallet */}
                    {isConnected && isWalletSigned && (
                        <>
                            <span className="text-sm text-gray-700 truncate max-w-[140px]">
                                {address}
                            </span>
                            <LogoutButton mode="web" />
                        </>
                    )}

                    {/* 3. Non connecté (ou signature non valide) */}
                    {!isConnected && <LoginWallet />}
                </div>
            </div>
        </header>
    );
}
