"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Blocos que entram com animação ao rolar a página. Só transform e opacity (ver styles/layout.css).
const TARGETS = [
  ".section-heading",
  ".category-list",
  ".product-tabs",
  ".product-grid > *",
  ".discount-heading",
  ".promo-overlay > *",
  ".product-main-image",
  ".product-summary",
  ".details-card",
  ".similar-section h2",
  ".footer-grid > *",
].join(", ");

const STAGGER_MS = 70;
const MAX_STAGGER_STEPS = 6;

/**
 * Animação de entrada dos blocos da página. Não renderiza nada.
 * - O conteúdo só é ocultado depois que este script roda: sem JavaScript, tudo fica visível.
 * - O que já está na primeira tela não é animado (evita piscar ao carregar).
 * - Com prefers-reduced-motion, não faz nada.
 * Roda de novo a cada troca de rota, porque o layout da loja persiste entre páginas.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fold = window.innerHeight * 0.9;
    const pending = Array.from(document.querySelectorAll<HTMLElement>(TARGETS)).filter(
      (el) => el.getBoundingClientRect().top > fold,
    );

    // Ao terminar a entrada, devolve ao elemento as próprias transições (hover dos cards etc.).
    const finish = (event: TransitionEvent) => {
      const el = event.currentTarget as HTMLElement;
      if (event.target !== el || event.propertyName !== "opacity") return;
      el.classList.remove("reveal", "is-visible");
      el.style.removeProperty("transition-delay");
      el.removeEventListener("transitionend", finish);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Escalona os blocos que entram juntos (ex.: os cards de uma mesma linha).
        let step = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.transitionDelay = `${Math.min(step, MAX_STAGGER_STEPS) * STAGGER_MS}ms`;
          el.addEventListener("transitionend", finish);
          el.classList.add("is-visible");
          observer.unobserve(el);
          step += 1;
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of pending) {
      el.classList.add("reveal");
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
      for (const el of pending) {
        el.removeEventListener("transitionend", finish);
        el.classList.remove("reveal", "is-visible");
        el.style.removeProperty("transition-delay");
      }
    };
  }, [pathname]);

  return null;
}
