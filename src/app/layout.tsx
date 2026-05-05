import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: "Sumato Exchange — Buy, Trade & Earn Crypto",
  description: "The world's leading cryptocurrency exchange. Trade Bitcoin, Ethereum, and 350+ altcoins with low fees and deep liquidity on Sumato Exchange.",
  keywords: "crypto exchange, bitcoin, ethereum, trading, BTC, ETH, spot trading, futures",
  openGraph: {
    title: "Sumato Exchange — Buy, Trade & Earn Crypto",
    description: "Trade 350+ cryptocurrencies with the lowest fees. Trusted by 350M+ users worldwide.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
