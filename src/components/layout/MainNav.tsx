"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Âncoras com "/" na frente para funcionar a partir de qualquer página, não só da Home.
const LINKS = [
  { href: "/", label: "Home" },
  { href: "/avaliacoes", label: "Avaliações" },
  { href: "/#categorias", label: "Categorias" },
  { href: "/#produtos", label: "Produtos" },
];

/** Navegação principal do header. Marca como ativa a página atual (âncoras nunca ficam ativas). */
export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="main-nav" aria-label="Navegação principal">
      {LINKS.map(({ href, label }) => {
        const active = !href.includes("#") && (href === "/" ? pathname === "/" : pathname.startsWith(href));
        return (
          <Link key={href} href={href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
