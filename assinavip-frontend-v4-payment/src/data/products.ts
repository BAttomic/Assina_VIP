export type Product = {
  id: string;
  name: string;
  duration: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
};

export const subscriptionProducts: Product[] = [
  { id: "spotify-90", name: "Spotify Premium", duration: "90 Dias", price: 9, image: "/assets/spotify.jpg", category: "Assinaturas", featured: true },
  { id: "netflix-30", name: "Netflix Premium 4K Ultra HD", duration: "30 Dias", price: 25.35, image: "/assets/netflix.jpg", category: "Assinaturas" },
  { id: "discord-30", name: "Discord Nitro", duration: "30 Dias", price: 3.99, image: "/assets/discord.jpg", category: "Assinaturas" },
  { id: "capcut-30", name: "Capcut Pro", duration: "30 Dias", price: 5.49, image: "/assets/capcut.jpg", category: "Assinaturas" },
  { id: "canva-30", name: "Canva Pro", duration: "30 Dias", price: 3.69, image: "/assets/canva.jpg", category: "Assinaturas" },
  { id: "galaxy-fold", name: "Galaxy Z Fold5 Unlocked", duration: "256GB | Phantom Black", price: 1799, image: "/assets/galaxy-fold.jpg", category: "Jogos" },
  { id: "galaxy-buds", name: "Galaxy Buds FE", duration: "Graphite", price: 99.99, image: "/assets/galaxy-buds.jpg", category: "Produtos" },
  { id: "ipad-9", name: "Apple iPad 9 10.2\" 64GB Wi-Fi", duration: "Silver (MK2L3) 2021", price: 398, image: "/assets/ipad.jpg", category: "Produtos" }
];

export const discountedProducts: Product[] = [
  { id: "iphone-14-512", name: "Apple iPhone 14 Pro 512GB Gold", duration: "(MQ233)", price: 1437, image: "/assets/iphone-gold.jpg", category: "Ofertas" },
  { id: "airpods-max", name: "AirPods Max Silver", duration: "Starlight Aluminium", price: 549, image: "/assets/airpods-max.jpg", category: "Ofertas" },
  { id: "watch-9", name: "Apple Watch Series 9 GPS", duration: "41mm Starlight Aluminium", price: 399, image: "/assets/apple-watch.jpg", category: "Ofertas" },
  { id: "iphone-14-1tb", name: "Apple iPhone 14 Pro 1TB Gold", duration: "(MQ2V3)", price: 1499, image: "/assets/iphone-blue.jpg", category: "Ofertas" }
];
