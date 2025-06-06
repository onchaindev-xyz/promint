// ✅ Chemin complet : /src/components/auth/SignWalletModal.tsx

import { useState, useEffect, useMemo } from "react";
import { useSignMessage } from "wagmi";
import { signIn, getCsrfToken } from "next-auth/react";

interface SignWalletModalProps {
    address: string;
    onSigned: () => void;
    onError: (message: string) => void;
}

export default function SignWalletModal({ address, onSigned, onError }: SignWalletModalProps) {
    const [isSigning, setIsSigning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [csrfToken, setCsrfToken] = useState<string | null>(null);

    const { signMessageAsync } = useSignMessage();

    // Récupère le csrfToken dès que la modale s'affiche (normalisé en string | null)
    useEffect(() => {
        getCsrfToken().then((token) => setCsrfToken(token ?? null));
    }, []);

    const SIWW_DOMAIN =
        typeof window !== "undefined" ? window.location.host : "pro.specuverse.xyz";
    const SIWW_STATEMENT =
        "Pour sécuriser votre session Promint, veuillez signer ce message afin de prouver que vous contrôlez ce wallet.";

    // Reconstruit le message SIWW avec le vrai nonce (csrfToken)
    const siwwMessage = useMemo(() => {
        return [
            "Sign-In With Wallet",
            `Domain: ${SIWW_DOMAIN}`,
            `Address: ${address}`,
            `Statement: ${SIWW_STATEMENT}`,
            `Nonce: ${csrfToken ?? "<csrfToken indisponible>"}`,
            `Issued At: ${new Date().toISOString()}`
        ].join("\n");
    }, [SIWW_DOMAIN, address, SIWW_STATEMENT, csrfToken]);

    const handleSign = async () => {
        if (!csrfToken) {
            setError("Le token de sécurité (csrfToken) n'a pas pu être chargé.");
            onError("csrfToken manquant");
            return;
        }
        setIsSigning(true);
        setError(null);
        try {
            const signature = await signMessageAsync({ message: siwwMessage });
            const res = await signIn("wallet", {
                message: siwwMessage,
                signature,
                address,
                redirect: false,
            });

            if (res && typeof res === "object" && "error" in res && res.error) {
                setError("Erreur d'authentification : " + res.error);
                onError(res.error);
                setIsSigning(false);
                return;
            }
            onSigned();
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
                    disabled={isSigning || !csrfToken}
                >
                    {isSigning
                        ? "Signature en cours..."
                        : !csrfToken
                            ? "Initialisation en cours…"
                            : "Signer pour finaliser"}
                </button>
                {error && <div className="text-red-600 mt-4 text-sm">{error}</div>}
            </div>
        </div>
    );
}
