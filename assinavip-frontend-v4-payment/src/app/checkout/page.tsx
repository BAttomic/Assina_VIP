"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Lock, Smartphone, WalletCards } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CreditCard3D from "../../components/CreditCard3D";

const MASK_CHAR = "•";

/* Impede que ferramentas de session replay/monitoramento gravem os campos. */
const PRIVATE_FIELD = {
  "data-private": "true",
  "data-sentry-mask": "true",
  "data-hj-suppress": "true",
} as const;

type PaymentMethod = "card" | "pix" | "crypto";

const onlyDigits = (value: string, max: number) => value.replace(/\D/g, "").slice(0, max);
const groupByFour = (value: string) => value.replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (value: string) => {
  const digits = onlyDigits(value, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export default function CheckoutPage() {
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [accepted, setAccepted] = useState(false);

  // Dados do cartão: ficam só em memória (nada de localStorage, URL ou cookies).
  const [cardNumber, setCardNumber] = useState(""); // somente dígitos
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState(""); // nunca é enviado ao cartão da cena
  const [focused, setFocused] = useState<string | null>(null);

  // Texto exibido no cartão. Com o campo fora de foco, o número fica mascarado.
  const numberFace = !cardNumber
    ? "0000 0000 0000 0000"
    : focused !== "number" && cardNumber.length >= 13
      ? groupByFour(MASK_CHAR.repeat(cardNumber.length - 4) + cardNumber.slice(-4))
      : groupByFour(cardNumber);
  const holderFace = cardHolder.trim() ? cardHolder.toUpperCase() : "NOME DO TITULAR";
  const expiryFace = cardExpiry || "MM/AA";

  const tabs: { id: PaymentMethod; label: string }[] = [
    { id: "card", label: "Cartão de Crédito" },
    { id: "pix", label: "Pix" },
    { id: "crypto", label: "Cripto" },
  ];

  return (
    <>
      <Header />
      <main className="payment-page">
        <div className="payment-shell">
          <div className="payment-title">
            <span className="payment-title-icon" aria-hidden="true">
              <Lock size={11} strokeWidth={2} />
            </span>
            <h1>Pagamento</h1>
          </div>

          <div className="payment-layout">
            <aside className="payment-summary">
              <h2>Resumo</h2>

              <div className="payment-product">
                <div className="payment-product-image">
                  <Image src="/assets/netflix.jpg" alt="Netflix" fill sizes="40px" />
                </div>
                <h3>Netflix Premium 4k Ultra HD | 30 Dias</h3>
                <strong>$1399</strong>
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
                <span>$1399</span>
              </div>
            </aside>

            <section className="payment-main">
              <h2>Pagamento</h2>

              <div className="payment-methods" role="tablist" aria-label="Método de pagamento">
                {tabs.map((tab) => (
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
                        number={numberFace}
                        holder={holderFace}
                        expiry={expiryFace}
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
                      onFocus={() => setFocused("holder")}
                      onBlur={() => setFocused(null)}
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
                      onFocus={() => setFocused("number")}
                      onBlur={() => setFocused(null)}
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
                      onFocus={() => setFocused("expiry")}
                      onBlur={() => setFocused(null)}
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
                      onFocus={() => setFocused("cvv")}
                      onBlur={() => setFocused(null)}
                      {...PRIVATE_FIELD}
                    />
                  </div>
                </>
              ) : method === "pix" ? (
                <div className="alternative-payment">
                  <div className="alternative-icon">
                    <Smartphone size={22} strokeWidth={1.4} />
                  </div>
                  <h3>Pagamento via Pix</h3>
                  <p>Após continuar, o código Pix será gerado para concluir o pagamento.</p>
                </div>
              ) : (
                <div className="alternative-payment">
                  <div className="alternative-icon">
                    <WalletCards size={22} strokeWidth={1.4} />
                  </div>
                  <h3>Pagamento em Cripto</h3>
                  <p>O método de pagamento em criptomoeda será disponibilizado na próxima etapa.</p>
                </div>
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
      <Footer />
    </>
  );
}
