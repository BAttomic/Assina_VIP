"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ReviewsSummary from "./ReviewsSummary";
import StarRating from "./StarRating";
import { formatReviewDate, reviewCountLabel } from "./reviewFormat";
import type { Review } from "./types";

type Sort = "recent" | "highest" | "lowest";

const SORT_OPTIONS: { id: Sort; label: string }[] = [
  { id: "recent", label: "Mais recentes" },
  { id: "highest", label: "Maior nota" },
  { id: "lowest", label: "Menor nota" },
];

const RATING_FILTERS = [5, 4, 3, 2, 1] as const;
const PAGE_SIZE = 10;

const normalize = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function sortReviews(reviews: Review[], sort: Sort) {
  const byDate = (a: Review, b: Review) => b.date.localeCompare(a.date);
  return [...reviews].sort((a, b) => {
    if (sort === "highest") return b.rating - a.rating || byDate(a, b);
    if (sort === "lowest") return a.rating - b.rating || byDate(a, b);
    return byDate(a, b);
  });
}

/**
 * Resumo, filtros e lista de avaliações. Só é renderizado quando há avaliações;
 * a página mostra ReviewsEmpty no lugar enquanto não houver nenhuma.
 * Filtro, ordenação, busca e "Mostrar mais" acontecem no navegador, sobre a lista recebida.
 */
export default function ReviewsView({ reviews }: { reviews: Review[] }) {
  const [rating, setRating] = useState<number | null>(null);
  const [sort, setSort] = useState<Sort>("recent");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const term = normalize(query.trim());
    const filtered = reviews.filter((review) => {
      if (rating !== null && review.rating !== rating) return false;
      if (!term) return true;
      return normalize(`${review.text} ${review.author} ${review.product ?? ""}`).includes(term);
    });
    return sortReviews(filtered, sort);
  }, [reviews, rating, sort, query]);

  const hasFilters = rating !== null || query.trim() !== "";
  const clearFilters = () => {
    setRating(null);
    setQuery("");
    setVisible(PAGE_SIZE);
  };
  const selectRating = (value: number | null) => {
    setRating(value);
    setVisible(PAGE_SIZE);
  };

  return (
    <>
      <ReviewsSummary reviews={reviews} selected={rating} onSelect={selectRating} />

      <section className="reviews-list-section" aria-labelledby="reviews-list-title">
        <div className="reviews-list-head">
          <h2 id="reviews-list-title">Todas as avaliações</h2>
          <p className="reviews-results" aria-live="polite">{reviewCountLabel(results.length)}</p>
        </div>

        <div className="reviews-toolbar">
          <div className="reviews-rating-filter" role="group" aria-label="Filtrar por nota">
            <button type="button" className={rating === null ? "active" : undefined} aria-pressed={rating === null} onClick={() => selectRating(null)}>
              Todas
            </button>
            {RATING_FILTERS.map((value) => (
              <button
                key={value}
                type="button"
                className={rating === value ? "active" : undefined}
                aria-pressed={rating === value}
                aria-label={`${value} ${value === 1 ? "estrela" : "estrelas"}`}
                onClick={() => selectRating(rating === value ? null : value)}
              >
                {value} ★
              </button>
            ))}
          </div>

          <label className="reviews-search">
            <Search size={18} strokeWidth={1.6} aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar nas avaliações"
              aria-label="Buscar nas avaliações"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setVisible(PAGE_SIZE); }}
            />
          </label>

          <label className="reviews-sort">
            <span>Ordenar por</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
              {SORT_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="reviews-no-results">
            <p className="reviews-no-results-title">Nenhuma avaliação encontrada</p>
            <p>Tente outra nota ou outro termo de busca.</p>
            {hasFilters && <button type="button" className="reviews-secondary-button" onClick={clearFilters}>Limpar filtros</button>}
          </div>
        ) : (
          <>
            <ol className="reviews-list">
              {results.slice(0, visible).map((review) => (
                <li key={review.id} className="review-item">
                  <article>
                    <header className="review-meta">
                      <StarRating value={review.rating} />
                      <time dateTime={review.date}>{formatReviewDate(review.date)}</time>
                    </header>
                    <h3 className="review-author">{review.author}</h3>
                    {review.product && <p className="review-product">Comprou {review.product}</p>}
                    <p className="review-text">{review.text}</p>
                  </article>
                </li>
              ))}
            </ol>

            {visible < results.length && (
              <button type="button" className="reviews-secondary-button reviews-more" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
                Mostrar mais avaliações
              </button>
            )}
          </>
        )}
      </section>
    </>
  );
}
