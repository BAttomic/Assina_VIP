/**
 * Categorias do catálogo (MOCK, como products.ts). Usadas na Home ("Pesquise por Categoria"),
 * em /categorias e em /categorias/[slug]. Quando o back-end existir, este tipo vira o contrato
 * de categoria e o array sai (ver docs/arquitetura.md).
 */
import { allProducts } from "./products";

export type Category = {
  /** Identificador usado na URL (/categorias/<slug>) e em Product.category. */
  slug: string;
  name: string;
  /** Uma frase sobre o que a categoria reúne, exibida na página dela. */
  description: string;
  /** Ícone em public/assets/icons. */
  icon: string;
};

/** "Os Mais Desejados" é uma curadoria, não uma categoria: reúne os produtos com featured: true. */
export const FEATURED_SLUG = "os-mais-desejados";

export const categories: Category[] = [
  { slug: FEATURED_SLUG, name: "Os Mais Desejados", description: "Os produtos em destaque na AssinaVip.", icon: "/assets/icons/category-most-wanted.svg" },
  { slug: "xbox-microsoft-store", name: "Xbox e Microsoft Store", description: "Assinaturas, créditos e jogos para Xbox e Microsoft Store.", icon: "/assets/icons/category-xbox.svg" },
  { slug: "twitch-drops", name: "Twitch Drops", description: "Itens e recompensas de Twitch Drops.", icon: "/assets/icons/category-twitch.svg" },
  { slug: "assinaturas", name: "Assinaturas", description: "Streaming, música e ferramentas com entrega automática.", icon: "/assets/icons/category-subscriptions.svg" },
  { slug: "jogos", name: "Jogos", description: "Jogos e chaves de ativação.", icon: "/assets/icons/category-games.svg" },
  { slug: "eletronicos", name: "Eletrônicos", description: "Celulares, tablets, fones e relógios.", icon: "/assets/icons/category-electronics.svg" },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function productsInCategory(slug: string) {
  if (slug === FEATURED_SLUG) return allProducts.filter((product) => product.featured);
  return allProducts.filter((product) => product.category === slug);
}
