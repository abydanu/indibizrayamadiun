import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/theme-provider";

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300','400','500','600','700','800'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Input Indibiz Telkom Madiun Raya",
  description: "Input Indibiz Telkom Madiun Raya dibuat untuk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${nunito.variable} ${nunito.className} antialiased`}
      >
        <ThemeProvider
          defaultTheme="light"
          storageKey="smartsync-ui-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
