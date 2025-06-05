import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Color Tools by thbo",
  description: "Try tools to test the colors on your screen or your website. Calculate the energy consumption of your screen.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "Color Tools by thbo",
    type: "website",
    locale: "en_US",
    description: "Try tools to test the colors on your screen or your website. Calculate the energy consumption of your screen.",
    url: "https://ct.thbo.ch/",
    siteName: "Color Tools",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
