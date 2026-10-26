/**
 * Formato de avaliação que a tela /avaliacoes espera receber.
 * PROVISÓRIO: ainda não existe API de avaliações. Alinhar estes campos com o back-end
 * quando o contrato for definido; a tela só depende do que está aqui.
 */
export type Review = {
  id: string;
  /** Nome exibido do cliente (ex.: "Mariana S."). */
  author: string;
  /** Nota inteira de 1 a 5. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Data da avaliação em ISO 8601 (ex.: "2026-10-12"). */
  date: string;
  text: string;
  /** Produto comprado, quando a avaliação estiver ligada a um pedido. */
  product?: string;
};
