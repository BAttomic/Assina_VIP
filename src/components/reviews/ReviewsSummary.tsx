import StarRating from "./StarRating";
import { averageRating, formatAverage, ratingDistribution, reviewCountLabel } from "./reviewFormat";
import type { Review } from "./types";

type Props = {
  reviews: Review[];
  /** Nota filtrada no momento (null = todas). As linhas da distribuição servem de atalho de filtro. */
  selected: number | null;
  onSelect: (rating: number | null) => void;
};

/** Nota média, total e distribuição por estrelas. */
export default function ReviewsSummary({ reviews, selected, onSelect }: Props) {
  const average = averageRating(reviews);
  const total = reviews.length;

  return (
    <section className="reviews-summary" aria-labelledby="reviews-summary-title">
      <h2 id="reviews-summary-title" className="reviews-visually-hidden">Resumo das avaliações</h2>

      <div className="reviews-average">
        <p className="reviews-average-value">{formatAverage(average)}</p>
        <StarRating value={average} size={22} />
        <p className="reviews-average-count">Média de {reviewCountLabel(total)}</p>
      </div>

      <ul className="reviews-distribution">
        {ratingDistribution(reviews).map(({ rating, count }) => {
          const share = total > 0 ? Math.round((count / total) * 100) : 0;
          const isSelected = selected === rating;
          return (
            <li key={rating}>
              <button
                type="button"
                className={isSelected ? "active" : undefined}
                aria-pressed={isSelected}
                disabled={count === 0}
                onClick={() => onSelect(isSelected ? null : rating)}
              >
                <span className="reviews-distribution-label">{rating} {rating === 1 ? "estrela" : "estrelas"}</span>
                <span className="reviews-distribution-track" aria-hidden="true">
                  <span style={{ width: `${share}%` }} />
                </span>
                <span className="reviews-distribution-count">{count.toLocaleString("pt-BR")}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
