import type { Metadata } from "next";
import ReviewsEmpty from "@/components/reviews/ReviewsEmpty";
import ReviewsView from "@/components/reviews/ReviewsView";
import type { Review } from "@/components/reviews/types";

export const metadata: Metadata = {
  title: "Avaliações | AssinaVip",
  description: "O que os clientes contam sobre comprar na AssinaVip.",
};

// Ainda não existe fonte de avaliações (sem back-end). Quando a API existir, buscar aqui
// (Server Component, pode ser async) e passar o resultado para ReviewsView.
// Não preencher com avaliações de exemplo: a página mostra o estado vazio até lá.
const reviews: Review[] = [];

export default function ReviewsPage() {
  return (
    <main className="reviews-page">
      <header className="reviews-head">
        <h1>Avaliações</h1>
        <p>O que os clientes contam sobre comprar na AssinaVip.</p>
      </header>

      {reviews.length === 0 ? <ReviewsEmpty /> : <ReviewsView reviews={reviews} />}
    </main>
  );
}
