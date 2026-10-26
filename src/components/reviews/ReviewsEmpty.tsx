import Link from "next/link";
import PurchaseBenefits from "@/components/product/PurchaseBenefits";

/** Estado da página enquanto não houver nenhuma avaliação publicada. */
export default function ReviewsEmpty() {
  return (
    <section className="reviews-empty" aria-labelledby="reviews-empty-title">
      <div className="reviews-empty-text">
        <h2 id="reviews-empty-title">Ainda não há avaliações</h2>
        <p>As avaliações dos clientes vão aparecer aqui, com a nota, o produto comprado e o comentário de cada um.</p>
        <Link href="/#produtos" className="reviews-primary-button">Ver produtos</Link>
      </div>

      <div className="reviews-empty-benefits">
        <h3>O que esperar da sua compra</h3>
        <PurchaseBenefits variant="list" />
      </div>
    </section>
  );
}
