"use client"; // Error boundaries precisam ser Client Components

import { useEffect } from "react";

/** Erro ao montar /avaliacoes (ex.: a API de avaliações não respondeu). */
export default function ReviewsError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error("Falha ao carregar avaliações:", error);
  }, [error]);

  return (
    <main className="reviews-page">
      <header className="reviews-head">
        <h1>Avaliações</h1>
        <p>O que os clientes contam sobre comprar na AssinaVip.</p>
      </header>

      <section className="reviews-empty reviews-error" role="alert">
        <div className="reviews-empty-text">
          <h2>Não foi possível carregar as avaliações</h2>
          <p>Verifique sua conexão e tente de novo em instantes.</p>
          <button type="button" className="reviews-primary-button" onClick={() => retry()}>Tentar de novo</button>
        </div>
      </section>
    </main>
  );
}
