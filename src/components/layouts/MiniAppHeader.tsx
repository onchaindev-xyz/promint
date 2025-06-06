// /src/components/layout/MiniAppHeader.tsx

"use client";

import LoginFarcaster from "~/components/auth/LoginFarcaster";

export default function MiniAppHeader() {
    return (
        <header className="w-full px-4 py-2 bg-white shadow">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">Promint — MiniApp</h1>
                <div className="flex items-center gap-3">
                    <LoginFarcaster />
                </div>
            </div>
        </header>
    );
}
