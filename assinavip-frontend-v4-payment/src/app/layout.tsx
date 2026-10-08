import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AssinaVip",
  description: "Assinaturas, jogos e produtos digitais.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
