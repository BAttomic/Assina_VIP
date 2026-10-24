import Image from "next/image";
import { formatPrice } from "@/lib/format";

// Mock: mesmo valor unitário do carrinho. Sai quando o pedido vier do back-end.
const ORDER_TOTAL = 13.99;

/** Coluna esquerda do checkout: item do pedido, contato e total. Valores ainda fixos (mock). */
export default function PaymentSummary() {
  return (
    <aside className="payment-summary">
      <h2>Resumo</h2>

      <div className="payment-product">
        <div className="payment-product-image">
          <Image src="/assets/netflix.jpg" alt="Netflix" fill sizes="40px" />
        </div>
        <h3>Netflix Premium 4k Ultra HD | 30 Dias</h3>
        <strong>{formatPrice(ORDER_TOTAL)}</strong>
      </div>

      <p className="contact-label" id="contact-label">
        Informações de Contato
      </p>
      <div className="contact-fields" role="group" aria-labelledby="contact-label">
        <input type="text" placeholder="Nome Completo" aria-label="Nome completo" autoComplete="name" />
        <input type="email" placeholder="Email" aria-label="Email" autoComplete="email" />
      </div>

      <div className="payment-total">
        <span>Total do Pedido</span>
        <span>{formatPrice(ORDER_TOTAL)}</span>
      </div>
    </aside>
  );
}
