// ✅ Chemin complet : /src/components/layouts/MiniAppLayout.tsx
"use client";

import Header from "./Header";

export default function MiniAppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-4 bg-white min-h-screen">
            <Header />
            {children}
        </div>
    );
}
