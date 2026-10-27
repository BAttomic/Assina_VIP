/** Links da navegação principal, usados no menu do desktop (MainNav) e no do celular (MobileMenu). */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/avaliacoes", label: "Avaliações" },
  { href: "/categorias", label: "Categorias" },
  { href: "/produtos", label: "Produtos" },
];

/** Página atual ou subpágina dela (ex.: /categorias/jogos marca "Categorias"). Âncoras nunca ficam ativas. */
export function isActiveLink(href: string, pathname: string) {
  if (href.includes("#")) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
