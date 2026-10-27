/**
 * Filtros do catálogo (/produtos) como funções puras. O estado mora na URL:
 *   ?categoria=assinaturas&q=netflix&ordem=menor-preco&min=10&max=50&pagina=2
 * Assim uma busca filtrada pode ser compartilhada, e a busca do header só precisa mandar ?q=.
 */
import { FEATURED_SLUG } from "@/data/categories";
import type { Product } from "@/data/products";

export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { id: "padrao", label: "Padrão" },
  { id: "menor-preco", label: "Menor preço" },
  { id: "maior-preco", label: "Maior preço" },
] as const;

export type Sort = (typeof SORT_OPTIONS)[number]["id"];

export type CatalogQuery = {
  category: string | null;
  term: string;
  sort: Sort;
  min: number | null;
  max: number | null;
  page: number;
};

type Params = { get(name: string): string | null };

const toPrice = (value: string | null) => {
  if (value === null || value.trim() === "") return null;
  const number = Number(value.replace(",", "."));
  return Number.isFinite(number) && number >= 0 ? number : null;
};

export function readQuery(params: Params): CatalogQuery {
  const sort = params.get("ordem");
  const page = Number(params.get("pagina"));
  return {
    category: params.get("categoria") || null,
    term: params.get("q") ?? "",
    sort: SORT_OPTIONS.some((option) => option.id === sort) ? (sort as Sort) : "padrao",
    min: toPrice(params.get("min")),
    max: toPrice(params.get("max")),
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

const normalize = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function inCategory(product: Product, category: string) {
  return category === FEATURED_SLUG ? Boolean(product.featured) : product.category === category;
}

/** Aplica categoria, busca e faixa de preço, e ordena. Não pagina. */
export function filterProducts(products: Product[], query: CatalogQuery) {
  const term = normalize(query.term.trim());
  const filtered = products.filter((product) => {
    if (query.category && !inCategory(product, query.category)) return false;
    if (query.min !== null && product.price < query.min) return false;
    if (query.max !== null && product.price > query.max) return false;
    return !term || normalize(`${product.name} ${product.duration}`).includes(term);
  });
  if (query.sort === "menor-preco") return [...filtered].sort((a, b) => a.price - b.price);
  if (query.sort === "maior-preco") return [...filtered].sort((a, b) => b.price - a.price);
  return filtered;
}

export function hasActiveFilters(query: CatalogQuery) {
  return Boolean(query.category || query.term.trim() || query.min !== null || query.max !== null);
}
