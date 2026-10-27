"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, isActiveLink } from "./navLinks";

/** Navegação principal do header no desktop. Marca como ativa a página atual. Abaixo de 900px dá lugar ao MobileMenu. */
export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="main-nav" aria-label="Navegação principal">
      {NAV_LINKS.map(({ href, label }) => {
        const active = isActiveLink(href, pathname);
        return (
          <Link key={href} href={href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
