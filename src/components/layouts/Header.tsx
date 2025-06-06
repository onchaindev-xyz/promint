// ✅ Chemin complet : /src/components/layout/Header.tsx
"use client";

import { useEnvironment } from "~/hooks/useEnvironment";
import MiniAppHeader from "./MiniAppHeader";
import WebHeader from "./WebHeader";

export default function Header() {
    const { isMiniApp } = useEnvironment();

    return isMiniApp ? <MiniAppHeader /> : <WebHeader />;
}
