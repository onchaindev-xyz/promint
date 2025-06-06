// ✅ Chemin complet : /src/components/auth/LoginWallet.tsx

import { useState, useCallback } from "react";
import { useAccount, useConnect, useDisconnect, Connector } from "wagmi";

export default function LoginWallet() {
    const { isConnected, address } = useAccount();
    const { connectAsync, connectors, status } = useConnect();
    const { disconnect } = useDisconnect();

    const [connectError, setConnectError] = useState<string | null>(null);

    // Handler typé strict
    const handleConnect = useCallback(
        async (connector: Connector) => {
            setConnectError(null);
            try {
                await connectAsync({ connector });
            } catch (err) {
                const message =
                    typeof err === "object" && err && "message" in err
                        ? String((err as { message?: string }).message)
                        : "Erreur inconnue lors de la connexion wallet.";
                setConnectError(message);
            }
        },
        [connectAsync]
    );

    // Mapping connectors
    const walletConnect = connectors.find((c) => c.id === "walletConnect");
    const metaMask = connectors.find((c) => c.id === "metaMaskSDK");
    const coinbase = connectors.find((c) => c.id === "coinbaseWalletSDK");

    // Rendu : affiche uniquement les boutons tant que pas isConnected
    if (isConnected) {
        // L'état "wallet signé" est affiché et géré par le layout parent (WebHeader)
        return (
            <div className="text-sm text-green-600">
                ✅ Wallet connecté ({address}){" "}
                <button
                    onClick={() => disconnect()}
                    className="ml-2 underline text-xs"
                >
                    Déconnexion
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {metaMask ? (
                <button
                    onClick={() => handleConnect(metaMask)}
                    disabled={status === "pending"}
                    className={`px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 ${status === "pending" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {status === "pending" ? "Connexion..." : "Se connecter avec MetaMask"}
                </button>
            ) : (
                <div className="text-sm text-yellow-900">MetaMask non disponible</div>
            )}

            {coinbase ? (
                <button
                    onClick={() => handleConnect(coinbase)}
                    disabled={status === "pending"}
                    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 ${status === "pending" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {status === "pending" ? "Connexion..." : "Se connecter avec Coinbase Wallet"}
                </button>
            ) : (
                <div className="text-sm text-blue-900">Coinbase Wallet non disponible</div>
            )}

            {walletConnect ? (
                <button
                    onClick={() => handleConnect(walletConnect)}
                    disabled={status === "pending"}
                    className={`px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 ${status === "pending" ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {status === "pending" ? "Connexion..." : "Se connecter avec WalletConnect"}
                </button>
            ) : (
                <div className="text-sm text-red-600">❌ WalletConnect non disponible</div>
            )}

            {connectError && <div className="text-red-600 text-sm">{connectError}</div>}
        </div>
    );
}
