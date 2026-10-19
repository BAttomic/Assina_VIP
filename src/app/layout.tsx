import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

// Fonte do Figma. Exposta como variável CSS e aplicada em base.css.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AssinaVip",
  description: "Assinaturas, jogos e produtos digitais.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
