/**
 * Formatação de preço. Toda exibição de preço passa por aqui, nunca formatar inline.
 *
 * ATENÇÃO: hoje existem DOIS formatos porque o front veio assim do Figma, e eles
 * divergem entre si (ver docs/pendencias.md). Ambos usam "$" e nenhum é BRL de fato.
 * Ao unificar, mude só este arquivo.
 */

/** Formato dos cards da vitrine: 25.35 -> "$25,35", 1799 -> "$1.799". */
export function formatPrice(price: number) {
  return `$${price.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/** Formato do carrinho e da página de produto: 13.99 -> "$1399" (sem separador decimal). */
export function formatPriceCompact(price: number) {
  return `$${price.toFixed(2).replace(".", "")}`;
}
