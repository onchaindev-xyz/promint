// /src/components/layouts/LayoutWrapper.tsx
"use client";

import { useEnvironment } from "~/hooks/useEnvironment";
import MiniAppLayout from "./MiniAppLayout";
import WebLayout from "./WebLayout";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const { isMiniApp } = useEnvironment();

    return isMiniApp ? <MiniAppLayout>{children}</MiniAppLayout> : <WebLayout>{children}</WebLayout>;
}
