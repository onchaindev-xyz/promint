// /src/components/auth/LoginFarcaster.tsx

"use client";

import { useState, useCallback } from "react";
import { signIn, signOut, getCsrfToken, useSession } from "next-auth/react";
import sdk, { SignIn as SignInCore } from "@farcaster/frame-sdk";

export default function LoginFarcaster() {
    const [signingIn, setSigningIn] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const [signInResult, setSignInResult] = useState<SignInCore.SignInResult>();
    const [signInFailure, setSignInFailure] = useState<string>();
    const { data: session, status } = useSession();

    const getNonce = useCallback(async (): Promise<string> => {
        const nonce = await getCsrfToken();
        if (!nonce) throw new Error("Impossible de générer un nonce CSRF.");
        return nonce;
    }, []);

    const handleSignIn = useCallback(async () => {
        try {
            setSigningIn(true);
            setSignInFailure(undefined);

            const nonce = await getNonce();
            const result = await sdk.actions.signIn({ nonce });
            setSignInResult(result);

            // On ne transmet QUE les champs déclarés côté credentials du provider (PAS de name/pfp !)
            await signIn("farcaster", {
                message: result.message,
                signature: result.signature,
                redirect: false,
            });
        } catch (e) {
            if (e instanceof SignInCore.RejectedByUser) {
                setSignInFailure("Signature annulée par l’utilisateur.");
                return;
            }
            setSignInFailure("Erreur inconnue pendant la connexion.");
        } finally {
            setSigningIn(false);
        }
    }, [getNonce]);

    const handleSignOut = useCallback(async () => {
        try {
            setSigningOut(true);
            await signOut({ redirect: false });
            setSignInResult(undefined);
        } finally {
            setSigningOut(false);
        }
    }, []);

    return (
        <div className="w-full max-w-xs mx-auto flex flex-col gap-3">
            {status !== "authenticated" && (
                <button
                    onClick={handleSignIn}
                    disabled={signingIn}
                    className="w-full px-4 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
                >
                    {signingIn ? "Connexion..." : "Se connecter avec Farcaster"}
                </button>
            )}
            {status === "authenticated" && (
                <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full px-4 py-2 rounded bg-gray-600 text-white font-semibold hover:bg-gray-700 disabled:opacity-50"
                >
                    {signingOut ? "Déconnexion..." : "Déconnexion"}
                </button>
            )}
            {session && (
                <div className="p-2 bg-gray-100 rounded font-mono text-xs text-gray-800 break-all">
                    <div className="font-semibold text-gray-500 mb-1">Session</div>
                    <pre>{JSON.stringify(session, null, 2)}</pre>
                </div>
            )}
            {signInFailure && !signingIn && (
                <div className="p-2 bg-red-100 rounded font-mono text-xs text-red-600">
                    <div className="font-semibold mb-1">Erreur</div>
                    <pre>{signInFailure}</pre>
                </div>
            )}
            {signInResult && !signingIn && (
                <div className="p-2 bg-green-100 rounded font-mono text-xs text-green-600">
                    <div className="font-semibold mb-1">Résultat SIWF</div>
                    <pre>{JSON.stringify(signInResult, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
