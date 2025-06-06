// ✅ Chemin complet : /src/components/layout/WebHeader.tsx
"use client";

import { useAccount } from "wagmi";
import LoginWallet from "../auth/LoginWallet";
import LogoutButton from "../auth/LogoutButton";

export default function WebHeader() {
    const { isConnected, address } = useAccount();

    return (
        <header className="w-full px-6 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Promint — Web</h1>
                <div className="flex items-center gap-4">
                    {isConnected ? (
                        <>
                            <span className="text-sm text-gray-700 truncate max-w-[140px]">
                                {address}
                            </span>
                            <LogoutButton mode="web" />
                        </>
                    ) : (
                        <LoginWallet />
                    )}
                </div>
            </div>
        </header>
    );
}
