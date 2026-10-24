import { CreditCard, ShieldCheck, UserCheck, Zap } from "lucide-react";

// Só fatos já garantidos pelo fluxo da loja (docs/arquitetura.md e docs/checkout-e-cartao-3d.md).
// Ao mudar uma regra de compra (ex.: cadastro obrigatório), atualize estes textos.
const BENEFITS = [
  { icon: Zap, title: "Entrega automática", text: "O acesso chega por e-mail assim que o pagamento é confirmado." },
  { icon: UserCheck, title: "Compra sem cadastro", text: "Só nome e e-mail para finalizar o pedido." },
  { icon: CreditCard, title: "Pix ou cartão", text: "Escolha a forma de pagamento no checkout." },
  { icon: ShieldCheck, title: "Pagamento protegido", text: "Os dados do cartão não ficam salvos." },
];

type Props = {
  /** "strip": faixa horizontal (Home). "list": lista vertical compacta (página de produto). */
  variant?: "strip" | "list";
};

/** Vantagens de comprar na AssinaVip, exibidas perto das decisões de compra. */
export default function PurchaseBenefits({ variant = "strip" }: Props) {
  return (
    <ul className={`purchase-benefits ${variant}`} aria-label="Vantagens da compra">
      {BENEFITS.map(({ icon: Icon, title, text }) => (
        <li key={title}>
          <span className="purchase-benefit-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.6} /></span>
          <span>
            <strong>{title}</strong>
            <span>{text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
