import Link from "next/link";

/**
 * Canal de suporte da loja. Ainda não definido: enquanto for null, "Suporte" aparece como "em breve".
 * Para ativar, troque por um endereço, por exemplo:
 *   "mailto:suporte@assinavip.battomic.com"   (e-mail)
 *   "https://wa.me/5511999999999"             (WhatsApp)
 *   "https://discord.gg/codigo-do-convite"    (Discord)
 */
const SUPPORT_URL: string | null = null;

type FooterLink = { label: string; href: string | null };

const QUICK_LINKS: FooterLink[] = [
  { label: "Início", href: "/" },
  { label: "Produtos", href: "/produtos" },
  { label: "Categorias", href: "/categorias" },
  { label: "Avaliações", href: "/avaliacoes" },
  { label: "Carrinho", href: "/carrinho" },
];

// Páginas de política ainda não existem: aparecem como "em breve" até ganharem rota e texto.
const HELP_LINKS: FooterLink[] = [
  { label: "Suporte", href: SUPPORT_URL },
  { label: "Termos de uso", href: null },
  { label: "Privacidade", href: null },
  { label: "Reembolso", href: null },
];

// Fatos do fluxo de compra atual (ver docs/paginas-e-fluxos.md).
const PURCHASE_FACTS = ["Pix", "Cartão de crédito", "Entrega automática por e-mail", "Compra sem cadastro"];

function FooterItem({ label, href }: FooterLink) {
  if (!href) {
    return (
      <li>
        <span className="footer-soon">{label} <span>(em breve)</span></span>
      </li>
    );
  }
  const external = !href.startsWith("/");
  return (
    <li>
      {external ? (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>{label}</a>
      ) : (
        <Link href={href}>{label}</Link>
      )}
    </li>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">AssinaVip</Link>
          <p>Assinaturas, jogos e produtos digitais com entrega automática. Compre sem cadastro e pague com Pix ou cartão.</p>
          <small>© {year} AssinaVip. Todos os direitos reservados.</small>
        </div>

        <nav className="footer-column" aria-labelledby="footer-quick-links">
          <h2 id="footer-quick-links">Links rápidos</h2>
          <ul>{QUICK_LINKS.map((link) => <FooterItem key={link.label} {...link} />)}</ul>
        </nav>

        <nav className="footer-column" aria-labelledby="footer-help">
          <h2 id="footer-help">Ajuda e políticas</h2>
          <ul>{HELP_LINKS.map((link) => <FooterItem key={link.label} {...link} />)}</ul>
        </nav>

        <div className="footer-column">
          <h2>Compra</h2>
          <ul>{PURCHASE_FACTS.map((fact) => <li key={fact}><span>{fact}</span></li>)}</ul>
        </div>
      </div>
    </footer>
  );
}
