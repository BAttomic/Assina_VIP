"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, X, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const basePrice = 13.99;

export default function CartPage() {
  const [quantity, setQuantity] = useState(1);
  const [promo, setPromo] = useState("");

  const total = useMemo(() => basePrice * quantity, [quantity]);

  return (
    <>
      <Header />
      <main className="cart-page">
        <div className="cart-shell">
          <div className="cart-title">
            <ShoppingCart size={25} strokeWidth={1.5} />
            <h1>Carrinho</h1>
          </div>

          <div className="cart-layout">
            <section className="cart-items" aria-label="Itens do carrinho">
              <article className="cart-item">
                <div className="cart-product-image">
                  <Image
                    src="/assets/netflix.jpg"
                    alt="Netflix Premium 4K Ultra HD"
                    fill
                    sizes="86px"
                  />
                </div>

                <div className="cart-product-info">
                  <h2>Netflix Premium 4k Ultra HD | 30 Dias</h2>
                  <p>#25139526913984</p>
                </div>

                <div className="quantity-control" aria-label="Quantidade">
                  <button
                    aria-label="Diminuir quantidade"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  >
                    <Minus size={12} strokeWidth={1.7} />
                  </button>
                  <span>{quantity}</span>
                  <button
                    aria-label="Aumentar quantidade"
                    onClick={() => setQuantity((value) => value + 1)}
                  >
                    <Plus size={12} strokeWidth={1.7} />
                  </button>
                </div>

                <strong className="cart-item-price">
                  ${total.toFixed(2).replace(".", "")}
                </strong>

                <button className="remove-item" aria-label="Remover produto">
                  <X size={18} strokeWidth={1.4} />
                </button>
              </article>

              <div className="cart-divider" />
            </section>

            <aside className="order-summary">
              <h2>Resumo do Pedido</h2>

              <label htmlFor="promo-code">Código Promocional</label>
              <input
                id="promo-code"
                value={promo}
                onChange={(event) => setPromo(event.target.value)}
                placeholder="Code"
              />

              <div className="summary-total">
                <span>Total do Pedido</span>
                <strong>${total.toFixed(2).replace(".", "")}</strong>
              </div>

              <Link href="/checkout" className="payment-button">
                Pagamento
              </Link>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
