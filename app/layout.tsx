import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import ClientBody from "@/components/ClientBody";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VIBED",
  description: "Welcome to VIBED",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ClientBody className={`${geistMono.variable} antialiased font-mona-regular`}>
          <ClerkProvider
            dynamic
            appearance={{
              variables: {
                colorPrimary: "#ffffff",
                colorBackground: "#000000",
                colorInputBackground: "#1a1a1a",
                colorInputText: "#ffffff",
                colorText: "#ffffff",
                colorTextSecondary: "#b3b3b3",
                colorNeutral: "#3a3a3a",
                colorDanger: "#dc2626",
                colorSuccess: "#10b981",
                colorWarning: "#f59e0b",
                borderRadius: "0.625rem",
              },
              elements: {
                card: "bg-[#1a1a1a] border-[#3a3a3a]",
                headerTitle: "text-white",
                headerSubtitle: "text-[#b3b3b3]",
                socialButtonsBlockButton: "border-[#3a3a3a] hover:bg-[#2a2a2a]",
                formButtonPrimary: "bg-white text-black hover:bg-gray-200",
                formFieldInput: "bg-[#1a1a1a] border-[#3a3a3a] text-white",
                footerActionLink: "text-white hover:text-gray-300",
              }
            }}
          >
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </ClerkProvider>
        </ClientBody>
      </body>
    </html>
  );
}
