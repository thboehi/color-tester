import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Algorithm Documentation - Color Tester",
  description: "Detailed explanation of the color analysis algorithm used for OLED energy efficiency calculations.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "Algorithm Documentation - Color Tester",
    type: "website",
    locale: "en_US",
    description: "Detailed explanation of the color analysis algorithm used for OLED energy efficiency calculations.",
    url: "https://ct.thbo.ch/algorithm",
    siteName: "Color Tester - Algorithm Documentation",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function AlgorithmLayout({ children }) {
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