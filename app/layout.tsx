import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Caprice",
  description: "Notion clone built with Next.js and Tailwind CSS",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)", //light mode
        url: "/logo.png",
        href: "/logo.png",
      },
      {
        media: "(prefers-color-scheme: dark)", //dark mode
        url: "/logo-dark.png",
        href: "/logo-dark.png",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
					storageKey="caprice-theme-2"	
				>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
