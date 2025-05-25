
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font';
import { GeistMono } from 'geist/font';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'BO3results｜YNUsv',
  description: 'BO3試合結果テキスト出力アプリ',
  manifest: '/BO3results-YNUsv/manifest.json', // Updated manifest path
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#3F51B5" />
      </head>
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
