/** Máscaras e formatação dos campos de cartão do checkout. Funções puras, sem estado. */

export const MASK_CHAR = "•";

/**
 * Atributos que impedem ferramentas de session replay/monitoramento
 * (Sentry, Hotjar e similares) de gravar o conteúdo do campo.
 * Todo input com dado de cartão precisa receber isto.
 */
export const PRIVATE_FIELD = {
  "data-private": "true",
  "data-sentry-mask": "true",
  "data-hj-suppress": "true",
} as const;

export const onlyDigits = (value: string, max: number) => value.replace(/\D/g, "").slice(0, max);

export const groupByFour = (value: string) => value.replace(/(.{4})/g, "$1 ").trim();

export const formatExpiry = (value: string) => {
  const digits = onlyDigits(value, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

/** Número exibido no cartão 3D. Fora de foco e com 13+ dígitos, só os 4 últimos aparecem. */
export function cardNumberFace(digits: string, isFocused: boolean) {
  if (!digits) return "0000 0000 0000 0000";
  if (!isFocused && digits.length >= 13) {
    return groupByFour(MASK_CHAR.repeat(digits.length - 4) + digits.slice(-4));
  }
  return groupByFour(digits);
}
