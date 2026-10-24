"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";

// Carrinho ainda é mock: um único item fixo, só a quantidade e o cupom são interativos.
const basePrice = 13.99;

export default function CartPage() {
  const [quantity, setQuantity] = useState(1);
  const [promo, setPromo] = useState("");

  const total = useMemo(() => basePrice * quantity, [quantity]);

  return (
    <main className="cart-page">
      <div className="cart-shell">
        <div className="cart-layout">
          <section className="cart-items" aria-label="Itens do carrinho">
            <div className="cart-title">
              <ShoppingCart size={26} strokeWidth={1.5} aria-hidden="true" />
              <h1>Carrinho</h1>
            </div>

            <article className="cart-item">
              <div className="cart-product-image">
                <Image
                  src="/assets/netflix.jpg"
                  alt="Netflix Premium 4K Ultra HD"
                  fill
                  sizes="90px"
                />
              </div>

              <div className="cart-product-info">
                <h2>Netflix Premium 4k Ultra HD | 30 Dias</h2>
                <p>#25139526913984</p>
              </div>

              <div className="quantity-control" aria-label="Quantidade">
                <button
                  type="button"
                  aria-label="Diminuir quantidade"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                  <Minus size={16} strokeWidth={1.6} />
                </button>
                <span aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  aria-label="Aumentar quantidade"
                  onClick={() => setQuantity((value) => value + 1)}
                >
                  <Plus size={16} strokeWidth={1.6} />
                </button>
              </div>

              <strong className="cart-item-price">{formatPrice(total)}</strong>

              <button type="button" className="remove-item" aria-label="Remover produto">
                <X size={22} strokeWidth={1.4} />
              </button>
            </article>
          </section>

          <aside className="order-summary">
            <h2>Resumo do Pedido</h2>

            <label htmlFor="promo-code">Código Promocional</label>
            <input
              id="promo-code"
              value={promo}
              onChange={(event) => setPromo(event.target.value)}
              placeholder="Digite seu cupom"
            />

            <div className="summary-total">
              <span>Total do Pedido</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            <Link href="/checkout" className="payment-button">
              Pagamento
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
