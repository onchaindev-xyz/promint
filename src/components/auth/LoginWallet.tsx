// /src/components/auth/LoginWallet.tsx

import { useState, useCallback, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage, Connector } from "wagmi";
import { signIn } from "next-auth/react";

// Composant modal pour la signature (affiché si wallet connecté)
function SignWalletModal({
    address,
    onSuccess,
    onError,
}: {
    address: string;
    onSuccess: () => void;
    onError: (message: string) => void;
}) {
    const [isSigning, setIsSigning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signMessageAsync } = useSignMessage();

    // Message SIWW standard
    const SIWW_DOMAIN = typeof window !== "undefined" ? window.location.host : "pro.specuverse.xyz";
    const SIWW_STATEMENT =
        "Pour sécuriser votre session Promint, veuillez signer ce message afin de prouver que vous contrôlez ce wallet.";
    const nonce = Math.floor(Math.random() * 1e16).toString();
    const siwwMessage = [
        "Sign-In With Wallet",
        `Domain: ${SIWW_DOMAIN}`,
        `Address: ${address}`,
        `Statement: ${SIWW_STATEMENT}`,
        `Nonce: ${nonce}`,
        `Issued At: ${new Date().toISOString()}`
    ].join("\n");

    const handleSign = async () => {
        setIsSigning(true);
        setError(null);
        try {
            const signature = await signMessageAsync({ message: siwwMessage });
            // Appel NextAuth signIn("wallet", ...)
            const res = await signIn("wallet", {
                message: siwwMessage,
                signature,
                address,
                redirect: false,
            });

            // signIn renvoie SignInResponse | undefined
            if (res && typeof res === "object" && "error" in res && res.error) {
                setError("Erreur d'authentification : " + res.error);
                onError(res.error);
                setIsSigning(false);
                return;
            }

            onSuccess();
            setIsSigning(false);
        } catch (err) {
            const message =
                typeof err === "object" && err && "message" in err
                    ? String((err as { message?: string }).message)
                    : "Erreur lors de la signature.";
            setError(message);
            onError(message);
            setIsSigning(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full flex flex-col items-center">
                <div className="font-semibold text-lg mb-2">Signature requise</div>
                <div className="text-sm text-gray-600 mb-4">
                    Pour sécuriser votre session, vous devez signer un message cryptographique.<br />
                    <span className="font-mono text-xs text-gray-400 block mt-2 break-all">{address}</span>
                </div>
                <button
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition disabled:opacity-50"
                    onClick={handleSign}
                    disabled={isSigning}
                >
                    {isSigning ? "Signature en cours..." : "Signer pour finaliser"}
                </button>
                {error && <div className="text-red-600 mt-4 text-sm">{error}</div>}
            </div>
        </div>
    );
}

export default function LoginWallet() {
    const { isConnected, address } = useAccount();
    const { connectAsync, connectors, status } = useConnect();
    const { disconnect } = useDisconnect();

    // Gère la modale de signature
    const [showSignModal, setShowSignModal] = useState(false);
    const [connectError, setConnectError] = useState<string | null>(null);

    // Log runtime pour debug (tu peux retirer en prod)
    // console.log(
    //     "[LoginWallet] connectors:",
    //     connectors.map((c) => ({
    //         id: c.id,
    //         name: c.name,
    //         ready: c.ready,
    //         type: c.type,
    //         provider: typeof c?.provider !== "undefined" ? "✅" : "❌"
    //     }))
    // );
    // console.log("[LoginWallet] status:", status);

    const walletConnect = connectors.find((c) => c.id === "walletConnect");
    const metaMask = connectors.find((c) => c.id === "metaMaskSDK");
    const coinbase = connectors.find((c) => c.id === "coinbaseWalletSDK");

    // Typage strict du connecteur wagmi
    const handleConnect = useCallback(
        async (connector: Connector) => {
            setConnectError(null);
            try {
                await connectAsync({ connector });
                setShowSignModal(true); // On affiche la modale dès que connecté
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

    // Si déjà connecté, afficher direct la modale
    useEffect(() => {
        if (isConnected && address) {
            setShowSignModal(true);
        }
    }, [isConnected, address]);

    // Gestion succès signature
    const handleSignSuccess = useCallback(() => {
        setShowSignModal(false);
        // Optionnel : reload, feedback, redirection, etc.
    }, []);

    // Gestion erreur signature
    const handleSignError = useCallback((message: string) => {
        setConnectError(message);
        // Optionnel : disconnect le wallet ?
    }, []);

    if (isConnected && !showSignModal) {
        return (
            <div className="text-sm text-green-600">
                ✅ Wallet connecté <button onClick={() => disconnect()} className="ml-2 underline text-xs">Déconnexion</button>
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

            {showSignModal && address && (
                <SignWalletModal
                    address={address}
                    onSuccess={handleSignSuccess}
                    onError={handleSignError}
                />
            )}
        </div>
    );
}
