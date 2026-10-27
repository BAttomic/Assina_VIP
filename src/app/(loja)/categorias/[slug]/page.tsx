import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { categories, getCategory, productsInCategory } from "@/data/categories";

// Só as categorias de src/data/categories.ts existem; qualquer outro slug dá 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/categorias/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCategory(slug);
  return category ? { title: `${category.name} | AssinaVip`, description: category.description } : {};
}

export default async function CategoryPage(props: PageProps<"/categorias/[slug]">) {
  const { slug } = await props.params;
  const category = getCategory(slug);
  if (!category) notFound();

  const products = productsInCategory(slug);

  return (
    <main className="category-page">
      <nav className="breadcrumb-wrap" aria-label="Você está em">
        <Link href="/">Home</Link>
        <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
        <Link href="/categorias">Categorias</Link>
        <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
        <span aria-current="page">{category.name}</span>
      </nav>

      <header className="categories-head category-head">
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </header>

      {products.length === 0 ? (
        <section className="category-empty" aria-labelledby="category-empty-title">
          <h2 id="category-empty-title">Ainda não há produtos nesta categoria</h2>
          <p>Novos produtos entram aqui assim que chegarem ao catálogo. Enquanto isso, veja as outras categorias.</p>
          <Link href="/categorias" className="categories-primary-button">Ver todas as categorias</Link>
        </section>
      ) : (
        <section className="category-products" aria-labelledby="category-products-title">
          <h2 id="category-products-title" className="category-products-count">
            {products.length} {products.length === 1 ? "produto" : "produtos"}
          </h2>
          <div className="product-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}
    </main>
  );
}
