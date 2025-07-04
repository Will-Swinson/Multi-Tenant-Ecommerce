import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Mintpath",
  description: "Gumroad like clone with multi-tenant functionality",
  icons: {
    icon: "/mintpath_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased`}>
        <NuqsAdapter>
          <TRPCReactProvider>
            {children}
            <Toaster />
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
