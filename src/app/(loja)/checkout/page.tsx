"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock } from "lucide-react";
import CreditCard3D from "@/components/checkout/CreditCard3D";
import PaymentSummary from "@/components/checkout/PaymentSummary";
import AlternativePayment from "@/components/checkout/AlternativePayment";
import {
  PRIVATE_FIELD,
  cardNumberFace,
  formatExpiry,
  groupByFour,
  onlyDigits,
} from "@/components/checkout/cardFormat";

type PaymentMethod = "card" | "pix" | "crypto";
type CardField = "holder" | "number" | "expiry" | "cvv";

const TABS: { id: PaymentMethod; label: string }[] = [
  { id: "card", label: "Cartão de Crédito" },
  { id: "pix", label: "Pix" },
  { id: "crypto", label: "Cripto" },
];

export default function CheckoutPage() {
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [accepted, setAccepted] = useState(false);

  // Dados do cartão: ficam só em memória (nada de localStorage, URL ou cookies).
  // O estado mora aqui, e não no formulário, para sobreviver à troca de aba Pix/Cripto.
  const [cardNumber, setCardNumber] = useState(""); // somente dígitos
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState(""); // nunca é enviado ao cartão da cena
  const [focused, setFocused] = useState<CardField | null>(null);

  // Liga foco/desfoco de um campo ao lado e à máscara do cartão 3D.
  const focusProps = (field: CardField) => ({
    onFocus: () => setFocused(field),
    onBlur: () => setFocused(null),
  });

  return (
    <main className="payment-page">
      <div className="payment-shell">
        <div className="payment-title">
          <span className="payment-title-icon" aria-hidden="true">
            <Lock size={11} strokeWidth={2} />
          </span>
          <h1>Pagamento</h1>
        </div>

        <div className="payment-layout">
          <PaymentSummary />

          <section className="payment-main">
            <h2>Pagamento</h2>

            <div className="payment-methods" role="tablist" aria-label="Método de pagamento">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  className={method === tab.id ? "active" : ""}
                  aria-selected={method === tab.id}
                  onClick={() => setMethod(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {method === "card" ? (
              <>
                <div className="card-stage" aria-hidden="true">
                  <div className="card-stage-inner">
                    <CreditCard3D
                      number={cardNumberFace(cardNumber, focused === "number")}
                      holder={cardHolder.trim() ? cardHolder.toUpperCase() : "NOME DO TITULAR"}
                      expiry={cardExpiry || "MM/AA"}
                      side={focused === "cvv" ? "back" : "front"}
                    />
                  </div>
                </div>

                <div className="card-fields">
                  <input
                    type="text"
                    className="span-2"
                    placeholder="Nome do Cartão"
                    aria-label="Nome do cartão"
                    autoComplete="cc-name"
                    spellCheck={false}
                    maxLength={26}
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.replace(/[^\p{L} '.-]/gu, ""))}
                    {...focusProps("holder")}
                    {...PRIVATE_FIELD}
                  />
                  <input
                    type="text"
                    className="span-2"
                    inputMode="numeric"
                    placeholder="Número do Cartão"
                    aria-label="Número do cartão"
                    autoComplete="cc-number"
                    value={groupByFour(cardNumber)}
                    onChange={(e) => setCardNumber(onlyDigits(e.target.value, 19))}
                    {...focusProps("number")}
                    {...PRIVATE_FIELD}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/AA"
                    aria-label="Validade (MM/AA)"
                    autoComplete="cc-exp"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    {...focusProps("expiry")}
                    {...PRIVATE_FIELD}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="CVV"
                    aria-label="Código de segurança (CVV)"
                    autoComplete="cc-csc"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(onlyDigits(e.target.value, 4))}
                    {...focusProps("cvv")}
                    {...PRIVATE_FIELD}
                  />
                </div>
              </>
            ) : (
              <AlternativePayment method={method} />
            )}

            <label className="terms-check">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
              />
              <span>
                Eu aceito os <Link href="/termos">termos e condições</Link> desta compra.
              </span>
            </label>

            <div className="payment-actions">
              <Link href="/carrinho" className="back-payment">
                Voltar
              </Link>
              <button type="button" className="pay-button" disabled={!accepted}>
                Pagar
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
