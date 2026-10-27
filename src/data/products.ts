/**
 * Dados MOCK do catálogo. Não há API ainda: tudo que a vitrine e a página de
 * produto exibem vem daqui. Quando o back-end existir, estes tipos viram o
 * contrato e os arrays saem (ver docs/arquitetura.md).
 */

export type Product = {
  id: string;
  name: string;
  /** Segunda linha do card: duração da assinatura ou variante do produto. */
  duration: string;
  price: number;
  image: string;
  /** Slug da categoria em src/data/categories.ts (ex.: "assinaturas"). */
  category: string;
  /** Com slug, o card vira link para /produto/[slug]. Hoje só o Netflix tem página. */
  slug?: string;
  featured?: boolean;
};

export type ProductDetail = {
  name: string;
  shortName: string;
  image: string;
  price: number;
  oldPrice: number;
  stock: number;
  description: string;
  specs: { label: string; value: string }[];
  steps: { title: string; text: string }[];
};

export const subscriptionProducts: Product[] = [
  { id: "spotify-90", name: "Spotify Premium", duration: "90 Dias", price: 9, image: "/assets/spotify.jpg", category: "assinaturas", featured: true },
  { id: "netflix-30", name: "Netflix Premium 4K Ultra HD", duration: "30 Dias", price: 25.35, image: "/assets/netflix.jpg", category: "assinaturas", slug: "netflix-premium" },
  { id: "discord-30", name: "Discord Nitro", duration: "30 Dias", price: 3.99, image: "/assets/discord.jpg", category: "assinaturas" },
  { id: "capcut-30", name: "Capcut Pro", duration: "30 Dias", price: 5.49, image: "/assets/capcut.jpg", category: "assinaturas" },
  { id: "canva-30", name: "Canva Pro", duration: "30 Dias", price: 3.69, image: "/assets/canva.jpg", category: "assinaturas" },
  { id: "galaxy-fold", name: "Galaxy Z Fold5 Unlocked", duration: "256GB | Phantom Black", price: 1799, image: "/assets/galaxy-fold.jpg", category: "eletronicos" },
  { id: "galaxy-buds", name: "Galaxy Buds FE", duration: "Graphite", price: 99.99, image: "/assets/galaxy-buds.jpg", category: "eletronicos" },
  { id: "ipad-9", name: "Apple iPad 9 10.2\" 64GB Wi-Fi", duration: "Silver (MK2L3) 2021", price: 398, image: "/assets/ipad.jpg", category: "eletronicos" }
];

export const discountedProducts: Product[] = [
  { id: "iphone-14-512", name: "Apple iPhone 14 Pro 512GB Gold", duration: "(MQ233)", price: 1437, image: "/assets/iphone-gold.jpg", category: "eletronicos" },
  { id: "airpods-max", name: "AirPods Max Silver", duration: "Starlight Aluminium", price: 549, image: "/assets/airpods-max.jpg", category: "eletronicos" },
  { id: "watch-9", name: "Apple Watch Series 9 GPS", duration: "41mm Starlight Aluminium", price: 399, image: "/assets/apple-watch.jpg", category: "eletronicos" },
  { id: "iphone-14-1tb", name: "Apple iPhone 14 Pro 1TB Gold", duration: "(MQ2V3)", price: 1499, image: "/assets/iphone-blue.jpg", category: "eletronicos" }
];

/** Catálogo completo (vitrine + ofertas), na ordem padrão da loja. Usado em /produtos e nas categorias. */
export const allProducts: Product[] = [...subscriptionProducts, ...discountedProducts];

/** Detalhe exibido em /produto/[slug]. Por enquanto é sempre o Netflix, qualquer que seja o slug. */
export const productDetail: ProductDetail = {
  name: "NETFLIX PREMIUM 4K ULTRA HD | 30 DIAS",
  shortName: "Netflix Premium",
  image: "/assets/netflix.jpg",
  price: 13.99,
  oldPrice: 14.99,
  stock: 8,
  description:
    "Acesso premium à plataforma nº 1 de filmes e séries, com a melhor qualidade disponível.",
  specs: [
    { label: "Formato", value: "Credenciais de acesso" },
    { label: "Entrega", value: "Automática" },
    { label: "Acesso", value: "Perfil exclusivo" },
    { label: "Garantia", value: "30 dias" },
  ],
  steps: [
    {
      title: "Receba as credenciais de acesso",
      text: "Após a confirmação do pagamento, você recebe automaticamente o login e a senha da conta.",
    },
    {
      title: "Acesse a Netflix e selecione seu perfil",
      text: "Entre com as credenciais recebidas e escolha o seu perfil individual para começar a usar.",
    },
    {
      title: "Aproveite filmes e séries em 4K",
      text: "Curta todo o catálogo da Netflix em Ultra HD durante 30 dias corridos a partir da entrega das credenciais.",
    },
  ],
};
