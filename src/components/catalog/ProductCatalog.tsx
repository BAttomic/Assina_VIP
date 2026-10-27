"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/data/products";
import { PAGE_SIZE, SORT_OPTIONS, filterProducts, hasActiveFilters, readQuery, type Sort } from "./catalogQuery";

export type CatalogCategory = { slug: string; name: string; count: number };

type Props = {
  products: Product[];
  categories: CatalogCategory[];
};

const productCount = (count: number) => `${count} ${count === 1 ? "produto" : "produtos"}`;

/**
 * Catálogo de /produtos: filtros (categoria e preço), busca, ordenação, grade e paginação.
 * O estado vive na URL (ver catalogQuery.ts); cada mudança faz router.replace sem rolar a página.
 * Precisa estar dentro de <Suspense> por usar useSearchParams numa página estática.
 */
export default function ProductCatalog({ products, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const query = readQuery(params);

  const [filtersOpen, setFiltersOpen] = useState(false);
  // Rascunho dos campos de preço: só vai para a URL ao aplicar.
  const [minDraft, setMinDraft] = useState(query.min?.toString() ?? "");
  const [maxDraft, setMaxDraft] = useState(query.max?.toString() ?? "");

  const update = (changes: Record<string, string | null>, resetPage = true) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    if (resetPage) next.delete("pagina");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = filterProducts(products, query);
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(query.page, pages);
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const active = hasActiveFilters(query);

  const applyPrice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let min = minDraft.trim();
    let max = maxDraft.trim();
    // Faixa invertida (mín. maior que máx.): troca os dois em vez de não mostrar nada.
    if (min && max && Number(min.replace(",", ".")) > Number(max.replace(",", "."))) [min, max] = [max, min];
    setMinDraft(min);
    setMaxDraft(max);
    update({ min, max });
  };

  const clearAll = () => {
    setMinDraft("");
    setMaxDraft("");
    router.replace(pathname, { scroll: false });
  };

  const goToPage = (target: number) => {
    update({ pagina: target > 1 ? String(target) : null }, false);
    document.getElementById("catalog-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="catalog">
      <button
        type="button"
        className="catalog-filters-toggle"
        aria-expanded={filtersOpen}
        aria-controls="catalog-filters"
        onClick={() => setFiltersOpen((open) => !open)}
      >
        <SlidersHorizontal size={18} strokeWidth={1.6} aria-hidden="true" />
        Filtros
      </button>

      <aside id="catalog-filters" className={`catalog-filters${filtersOpen ? " open" : ""}`} aria-label="Filtros">
        <div className="catalog-filters-head">
          <h2>Filtros</h2>
          <button type="button" className="catalog-filters-close" aria-label="Fechar filtros" onClick={() => setFiltersOpen(false)}>
            <X size={20} strokeWidth={1.6} />
          </button>
        </div>

        <section className="catalog-filter-group" aria-labelledby="filter-category-title">
          <h3 id="filter-category-title">Categoria</h3>
          <ul>
            <li>
              <button type="button" className={query.category === null ? "active" : undefined} aria-pressed={query.category === null} onClick={() => update({ categoria: null })}>
                <span>Todas as categorias</span>
                <span className="catalog-filter-count">{products.length}</span>
              </button>
            </li>
            {categories.map(({ slug, name, count }) => (
              <li key={slug}>
                <button type="button" className={query.category === slug ? "active" : undefined} aria-pressed={query.category === slug} onClick={() => update({ categoria: slug })}>
                  <span>{name}</span>
                  <span className="catalog-filter-count">{count}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <form className="catalog-filter-group catalog-price" aria-labelledby="filter-price-title" onSubmit={applyPrice}>
          <h3 id="filter-price-title">Preço</h3>
          <div className="catalog-price-fields">
            <label>
              <span>Mínimo (R$)</span>
              <input type="number" inputMode="decimal" min="0" step="0.01" placeholder="0" value={minDraft} onChange={(event) => setMinDraft(event.target.value)} />
            </label>
            <label>
              <span>Máximo (R$)</span>
              <input type="number" inputMode="decimal" min="0" step="0.01" placeholder="Sem limite" value={maxDraft} onChange={(event) => setMaxDraft(event.target.value)} />
            </label>
          </div>
          <button type="submit" className="catalog-secondary-button">Aplicar preço</button>
        </form>

        {active && <button type="button" className="catalog-clear" onClick={clearAll}>Limpar filtros</button>}
      </aside>

      <section id="catalog-results" className="catalog-results" aria-labelledby="catalog-results-title">
        <h2 id="catalog-results-title" className="catalog-visually-hidden">Resultados</h2>

        <div className="catalog-toolbar">
          <label className="catalog-search">
            <Search size={20} strokeWidth={1.6} aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar produtos no catálogo"
              aria-label="Buscar produtos no catálogo"
              value={query.term}
              onChange={(event) => update({ q: event.target.value })}
            />
          </label>
          <label className="catalog-sort">
            <span>Ordenar por</span>
            <select value={query.sort} onChange={(event) => update({ ordem: event.target.value === "padrao" ? null : (event.target.value as Sort) })}>
              {SORT_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>
        </div>

        <p className="catalog-count" aria-live="polite">{productCount(results.length)}</p>

        {results.length === 0 ? (
          <div className="catalog-empty">
            <p className="catalog-empty-title">Nenhum produto encontrado</p>
            <p>Tente outro termo de busca, outra categoria ou uma faixa de preço maior.</p>
            <button type="button" className="catalog-secondary-button" onClick={clearAll}>Limpar filtros</button>
          </div>
        ) : (
          <div className="product-grid catalog-grid">
            {visible.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}

        {pages > 1 && (
          <nav className="catalog-pagination" aria-label="Páginas de resultados">
            <button type="button" aria-label="Página anterior" disabled={page === 1} onClick={() => goToPage(page - 1)}>
              <ChevronLeft size={18} strokeWidth={1.8} />
            </button>
            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
              <button key={number} type="button" className={number === page ? "active" : undefined} aria-current={number === page ? "page" : undefined} onClick={() => goToPage(number)}>
                {number}
              </button>
            ))}
            <button type="button" aria-label="Próxima página" disabled={page === pages} onClick={() => goToPage(page + 1)}>
              <ChevronRight size={18} strokeWidth={1.8} />
            </button>
            <span className="catalog-page-label">Página {page} de {pages}</span>
          </nav>
        )}
      </section>
    </div>
  );
}
