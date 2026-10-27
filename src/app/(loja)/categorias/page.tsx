import type { Metadata } from "next";
import CategoryBrowser from "@/components/categories/CategoryBrowser";
import { categories, productsInCategory } from "@/data/categories";

export const metadata: Metadata = {
  title: "Categorias | AssinaVip",
  description: "Assinaturas, jogos e eletrônicos organizados por categoria.",
};

export default function CategoriesPage() {
  const summaries = categories.map(({ slug, name, icon }) => ({
    slug,
    name,
    icon,
    productCount: productsInCategory(slug).length,
  }));

  return (
    <main className="categories-page">
      <header className="categories-head">
        <h1>Categorias</h1>
        <p>Assinaturas, jogos e eletrônicos organizados para você encontrar o que procura.</p>
      </header>

      <CategoryBrowser categories={summaries} />
    </main>
  );
}
