import Link from "next/link";
import { Search, ShoppingCart, UserRound, Zap } from "lucide-react";
import MainNav from "@/components/layout/MainNav";

export default function Header() {
  return (
    <>
      <p className="announcement-bar">
        <Zap size={14} strokeWidth={2} aria-hidden="true" />
        Entrega automática: o acesso chega por e-mail assim que o pagamento é confirmado
      </p>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="AssinaVip">
            AssinaVip
          </Link>

          <div className="search-box">
            <Search size={22} strokeWidth={1.5} aria-hidden="true" />
            <input type="search" aria-label="Pesquisar produtos" placeholder="Buscar produtos" />
          </div>

          <MainNav />

          <div className="header-actions">
            <Link href="/carrinho" aria-label="Carrinho"><ShoppingCart size={26} strokeWidth={1.5} /></Link>
            <button type="button" aria-label="Conta"><UserRound size={26} strokeWidth={1.5} /></button>
          </div>
        </div>
      </header>
    </>
  );
}
