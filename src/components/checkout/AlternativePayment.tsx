import { Smartphone, WalletCards } from "lucide-react";

const CONTENT = {
  pix: {
    icon: Smartphone,
    title: "Pagamento via Pix",
    text: "Após continuar, o código Pix será gerado para concluir o pagamento.",
  },
  crypto: {
    icon: WalletCards,
    title: "Pagamento em Cripto",
    text: "O método de pagamento em criptomoeda será disponibilizado na próxima etapa.",
  },
} as const;

/** Painel exibido no lugar do cartão quando o método é Pix ou Cripto. */
export default function AlternativePayment({ method }: { method: keyof typeof CONTENT }) {
  const { icon: Icon, title, text } = CONTENT[method];

  return (
    <div className="alternative-payment">
      <div className="alternative-icon">
        <Icon size={22} strokeWidth={1.4} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
