import type { Metadata } from 'next';
import { Inter, Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    display: 'swap',
});

const notoSansKr = Noto_Sans_KR({
    variable: '--font-noto-sans-kr',
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    title: {
        default: 'CloudNote',
        template: '%s | CloudNote',
    },
    description: 'AI 기술을 활용한 지능형 메모 서비스',
    openGraph: {
        title: 'CloudNote - 당신의 아이디어를 AI와 함께',
        description: 'AI 기술을 활용하여 당신의 메모를 분석하고 요약합니다.',
        url: '/',
        siteName: 'CloudNote',
        locale: 'ko_KR',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'CloudNote Preview',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CloudNote',
        description: 'AI 기술을 활용한 지능형 메모 서비스',
        images: ['/og-image.png'],
    },
    icons: {
        icon: '/favicon.ico', // Assuming favicon exists since Next.js default
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" className="h-full">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </head>
            <body className={`${inter.variable} ${notoSansKr.variable} font-sans antialiased h-full bg-background text-foreground`}>
                {children}
            </body>
        </html>
    );
}
