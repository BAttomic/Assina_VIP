/** Funções puras da tela de Avaliações: datas, média e distribuição de notas. */
import type { Review } from "./types";

const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" });
// "2026-10-20" é lido como meia-noite UTC; no fuso do Brasil isso ainda é dia 19.
// Datas sem horário são formatadas em UTC para mostrar o dia do calendário.
const calendarDateFormat = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const averageFormat = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** "2026-10-12" -> "12 de outubro de 2026". Data inválida volta como veio. */
export function formatReviewDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? calendarDateFormat.format(date) : dateFormat.format(date);
}

/** Média das notas, ex.: 4.75 -> "4,8". */
export function formatAverage(value: number) {
  return averageFormat.format(value);
}

export function averageRating(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
}

/** Quantidade de avaliações por nota, da 5 para a 1. */
export function ratingDistribution(reviews: Review[]) {
  return ([5, 4, 3, 2, 1] as const).map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
  }));
}

/** "1 avaliação" / "12 avaliações". */
export function reviewCountLabel(count: number) {
  return `${count.toLocaleString("pt-BR")} ${count === 1 ? "avaliação" : "avaliações"}`;
}
