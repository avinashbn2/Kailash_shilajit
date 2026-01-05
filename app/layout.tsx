import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import FloatingChatSupport from "./components/FloatingChatSupport";
import FloatingVideoWidget from "./components/FloatingVideoWidget";
import Header from "./components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Kailash.asia",
  description: "Kailash Shilajit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
      >
        <Header />
        {children}
        <FloatingVideoWidget
          videoSource="https://ik.imagekit.io/gqrc4jrxj/kailash/Shilajit%20Documentry%20720p.mov"
        />
        <FloatingChatSupport />
      </body>
    </html>
  );
}
