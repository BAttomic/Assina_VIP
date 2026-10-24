/**
 * Formatação de preço. Toda exibição de preço passa por aqui, nunca formatar inline.
 * Formato único da loja: real brasileiro, "R$ 13,99".
 */

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 13.99 -> "R$ 13,99"; 1799 -> "R$ 1.799,00". */
export function formatPrice(price: number) {
  // O Intl usa espaço não separável depois de "R$"; ele mantém símbolo e valor na mesma linha.
  return brl.format(price);
}

/** Desconto inteiro de um preço antigo para o atual: (14.99, 13.99) -> 7. Zero quando não há desconto. */
export function discountPercent(oldPrice: number, price: number) {
  if (!(oldPrice > price) || oldPrice <= 0) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}
