// ✅ Chemin complet : /src/components/auth/LoginWallet.tsx

import { useCallback } from "react";
import { useAccount, useConnect } from "wagmi";

export default function LoginWallet() {
    const { isConnected } = useAccount();
    const { connectAsync, connectors, status } = useConnect();

    // Log runtime : liste complète des connecteurs
    console.log(
        "[LoginWallet] connectors:",
        connectors.map((c) => ({
            id: c.id,
            name: c.name,
            ready: c.ready,
            type: c.type,
            provider: typeof c?.provider !== "undefined" ? "✅" : "❌"
        }))
    );
    console.log("[LoginWallet] status:", status);

    const walletConnect = connectors.find((c) => c.id === "walletConnect");
    const metaMask = connectors.find((c) => c.id === "metaMaskSDK");
    const coinbase = connectors.find((c) => c.id === "coinbaseWalletSDK");


    console.log("[LoginWallet] metaMask connector:", metaMask);
    console.log("[LoginWallet] coinbase connector:", coinbase);
    console.log("[LoginWallet] walletConnect connector:", walletConnect);

    // Handlers explicites pour chaque connecteur
    const handleConnect = useCallback(async (connector: typeof connectors[0]) => {
        console.log(`[LoginWallet] Attempting connect: ${connector?.id} (${connector?.name})`);
        try {
            const result = await connectAsync({ connector });
            console.log(`[LoginWallet] ✅ Connexion réussie avec ${connector.name} :`, result.accounts?.[0]);
        } catch (err) {
            console.error(`[LoginWallet] ❌ Erreur de connexion avec ${connector.name} :`, err);
        }
    }, [connectAsync]);

    if (isConnected) {
        console.log("[LoginWallet] ✅ Wallet déjà connecté (isConnected=true)");
        return <div className="text-sm text-green-600">✅ Wallet connecté</div>;
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
        </div>
    );
}
