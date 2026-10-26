import { Star } from "lucide-react";

type Props = {
  /** Nota de 0 a 5. Frações arredondam para a estrela mais próxima. */
  value: number;
  size?: number;
};

/** Cinco estrelas, preenchidas até a nota. Lida por leitores de tela como "Nota X de 5". */
export default function StarRating({ value, size = 16 }: Props) {
  const filled = Math.round(value);
  return (
    <span className="star-rating" role="img" aria-label={`Nota ${value.toLocaleString("pt-BR")} de 5`}>
      {[1, 2, 3, 4, 5].map((position) => (
        <Star
          key={position}
          size={size}
          strokeWidth={1.5}
          className={position <= filled ? "is-filled" : undefined}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
