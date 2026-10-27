import type { Metadata } from "next";
import { Suspense } from "react";
import ProductCard from "@/components/product/ProductCard";
import ProductCatalog from "@/components/catalog/ProductCatalog";
import { categories, productsInCategory } from "@/data/categories";
import { allProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Produtos | AssinaVip",
  description: "Todo o catálogo da AssinaVip: assinaturas, jogos e eletrônicos.",
};

export default function ProductsPage() {
  const categoryOptions = categories.map(({ slug, name }) => ({ slug, name, count: productsInCategory(slug).length }));

  return (
    <main className="catalog-page">
      <header className="catalog-head">
        <h1>Produtos</h1>
        <p>{allProducts.length} produtos entre assinaturas, jogos e eletrônicos. Confira o tipo do produto antes de comprar.</p>
      </header>

      {/* O catálogo lê filtros da URL (useSearchParams). Enquanto carrega, ou sem JavaScript, mostra a grade completa. */}
      <Suspense
        fallback={
          <div className="catalog-fallback product-grid">
            {allProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        }
      >
        <ProductCatalog products={allProducts} categories={categoryOptions} />
      </Suspense>
    </main>
  );
}
