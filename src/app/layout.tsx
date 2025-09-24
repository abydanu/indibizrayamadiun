import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/theme-provider";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Input Indibiz Telkom Madiun Raya",
    template: "%s | Indibiz Telkom Madiun",
  },
  description:
    "Aplikasi Input Indibiz Telkom Madiun Raya untuk mempermudah pengelolaan data pelanggan dan paket internet secara cepat dan efisien.",
  keywords: [
    "Indibiz",
    "Telkom Madiun",
    "Paket Internet",
    "Input Data",
    "Madiun Raya",
  ],
  authors: [{ name: "Telkom Madiun Raya" }],
  openGraph: {
    title: "Input Indibiz Telkom Madiun Raya",
    description:
      "Platform resmi untuk input data pelanggan dan paket Indibiz Telkom di wilayah Madiun Raya.",
    url: "https://indibizrayamadiun.vercel.app",
    siteName: "Indibiz Telkom Madiun Raya",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Indibiz Telkom Madiun Raya",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Input Indibiz Telkom Madiun Raya",
    description:
      "Input data pelanggan dan paket Indibiz Telkom Madiun Raya lebih mudah dan cepat.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  metadataBase: new URL("https://indibizrayamadiun.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${nunito.variable} ${nunito.className} antialiased`}>
        <ThemeProvider defaultTheme="light" storageKey="smartsync-ui-theme">
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
