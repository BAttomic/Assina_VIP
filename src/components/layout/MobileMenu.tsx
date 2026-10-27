"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, isActiveLink } from "./navLinks";

/**
 * Menu do celular (abaixo de 900px, onde a MainNav some). Botão no header que abre um painel
 * logo abaixo dele. Fecha ao trocar de página, com Esc ou ao tocar fora do painel.
 */
export default function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const rootRef = useRef<HTMLDivElement>(null);

  // Trocou de página com o menu aberto: fecha. (Ajuste de estado durante o render, sem efeito.)
  if (open && openedAt !== pathname) setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const toggle = () => {
    setOpenedAt(pathname);
    setOpen((value) => !value);
  };

  return (
    <div className="mobile-menu" ref={rootRef}>
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={toggle}
      >
        {open ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
      </button>

      <nav id="mobile-menu-panel" className={`mobile-menu-panel${open ? " open" : ""}`} aria-label="Menu" hidden={!open}>
        <ul>
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActiveLink(href, pathname);
            return (
              <li key={href}>
                <Link href={href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
