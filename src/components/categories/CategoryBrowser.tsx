"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";

export type CategorySummary = {
  slug: string;
  name: string;
  icon: string;
  productCount: number;
};

const normalize = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const countLabel = (count: number) =>
  count === 0 ? "Nenhum produto ainda" : `${count} ${count === 1 ? "produto" : "produtos"}`;

/** Busca e grade de categorias de /categorias. A busca filtra pelo nome, sem acentos. */
export default function CategoryBrowser({ categories }: { categories: CategorySummary[] }) {
  const [query, setQuery] = useState("");
  const term = normalize(query.trim());
  const results = term ? categories.filter((category) => normalize(category.name).includes(term)) : categories;

  return (
    <section className="categories-browser" aria-label="Lista de categorias">
      <label className="categories-search">
        <Search size={20} strokeWidth={1.6} aria-hidden="true" />
        <input
          type="search"
          placeholder="Buscar categorias"
          aria-label="Buscar categorias"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <p className="categories-count" aria-live="polite">
        {results.length} {results.length === 1 ? "categoria" : "categorias"}
      </p>

      {results.length === 0 ? (
        <div className="categories-no-results">
          <p className="categories-no-results-title">Nenhuma categoria encontrada</p>
          <p>Tente outro nome ou veja todas as categorias.</p>
          <button type="button" className="categories-secondary-button" onClick={() => setQuery("")}>Ver todas</button>
        </div>
      ) : (
        <ul className="categories-grid">
          {results.map(({ slug, name, icon, productCount }) => (
            <li key={slug}>
              <Link href={`/categorias/${slug}`} className="category-tile">
                <span className="category-tile-icon"><Image src={icon} alt="" width={56} height={56} /></span>
                <span className="category-tile-text">
                  <span className="category-tile-name">{name}</span>
                  <span className="category-tile-count">{countLabel(productCount)}</span>
                </span>
                <ArrowRight className="category-tile-arrow" size={22} strokeWidth={1.6} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
