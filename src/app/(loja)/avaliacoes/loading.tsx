/** Carregamento de /avaliacoes: esqueleto do resumo e da lista, enquanto a busca de avaliações não termina. */
export default function ReviewsLoading() {
  return (
    <main className="reviews-page" aria-busy="true">
      <header className="reviews-head">
        <h1>Avaliações</h1>
        <p>Carregando avaliações…</p>
      </header>

      <div className="reviews-skeleton" aria-hidden="true">
        <span className="reviews-skeleton-block summary" />
        <span className="reviews-skeleton-block line" />
        <span className="reviews-skeleton-block line" />
        <span className="reviews-skeleton-block line short" />
      </div>
    </main>
  );
}
