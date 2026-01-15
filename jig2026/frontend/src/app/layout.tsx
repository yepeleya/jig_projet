import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import 'aos/dist/aos.css';
import Providers from "@/lib/providers";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer";
import AuthInitializer from "@/components/AuthInitializer";


const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "JIG 2026 - Journée de l'Infographiste",
  description: "Une journée riche en découvertes ! Photographie, PAO, Animations 2D et 3D, et plus encore.",
  keywords: "JIG 2026, infographiste, photographie, PAO, animation, 3D, design, ISTC, créativité",
  authors: [{ name: "ISTC Polytechnique - JIG 2026" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#9E1B32" />
      </head>
      <body 
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <AuthInitializer />
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
