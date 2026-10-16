import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Casca da loja: toda página dentro de (loja) ganha Header e Footer.
 * A página renderiza só o próprio <main>. Rotas que não devem ter a casca
 * (ex.: painel administrativo) ficam fora deste route group.
 */
export default function LojaLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
