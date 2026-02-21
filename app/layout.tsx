import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Medical Atlas",
    default: "Medical Atlas — Your guide to understanding health",
  },
  description:
    "Clinically accurate, easy-to-read medical information in Arabic and English. Explore conditions, drugs, tests, and health calculators.",
  metadataBase: new URL("https://themedicalatlas.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
