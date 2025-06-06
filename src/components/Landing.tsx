// 📄 /src/components/Landing.tsx
'use client';

import { APP_NAME } from '~/lib/constants';
import Link from 'next/link';

interface LandingProps {
    title?: string;
}

export default function Landing({ title = APP_NAME }: LandingProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
            <div className="max-w-2xl text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold">
                    Bienvenue sur {title}
                </h1>
                <p className="text-lg text-gray-300">
                    Découvrez, achetez et listez vos NFTs sur la première Mini App Farcaster propulsée par Zora + Reservoir.
                </p>
                <Link
                    href="/explore"
                    className="inline-block rounded-md bg-white text-black font-semibold px-6 py-3 hover:bg-gray-200 transition"
                >
                    Explorer les NFTs
                </Link>
            </div>
        </div>
    );
}
