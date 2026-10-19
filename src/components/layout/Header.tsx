import Link from "next/link";
import { Search, ShoppingCart, UserRound } from "lucide-react";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="AssinaVip">
          AssinaVip
        </Link>

        <div className="search-box">
          <Search size={22} strokeWidth={1.5} aria-hidden="true" />
          <input type="search" aria-label="Pesquisar" placeholder="Search" />
        </div>

        <nav className="main-nav" aria-label="Navegação principal">
          <Link href="/" className="active">Home</Link>
          <Link href="#avaliacoes">Avaliações</Link>
          <Link href="#categorias">Categorias</Link>
          <Link href="#produtos">Produtos</Link>
        </nav>

        <div className="header-actions">
          <Link href="/carrinho" aria-label="Carrinho"><ShoppingCart size={26} strokeWidth={1.5} /></Link>
          <button type="button" aria-label="Conta"><UserRound size={26} strokeWidth={1.5} /></button>
        </div>
      </div>
    </header>
  );
}
