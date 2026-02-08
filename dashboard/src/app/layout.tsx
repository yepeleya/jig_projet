import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/providers";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard Admin - JIG 2026",
  description: "Interface d'administration pour la Journée de l'Innovation Globale 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Supprimer les erreurs d'hydratation des extensions de navigateur
              (function() {
                const originalError = console.error;
                console.error = function(message) {
                  if (
                    typeof message === 'string' && 
                    (message.includes('Hydration failed') ||
                     message.includes('There was an error while hydrating') ||
                     message.includes('bis_skin_checked') ||
                     message.includes('__processed_') ||
                     message.includes('bis_register'))
                  ) {
                    return;
                  }
                  originalError.apply(console, arguments);
                };
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
