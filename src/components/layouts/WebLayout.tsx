// ✅ Chemin complet : /src/components/layouts/WebLayout.tsx
"use client";

import Header from "./Header";

export default function WebLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            {children}
        </div>
    );
}
