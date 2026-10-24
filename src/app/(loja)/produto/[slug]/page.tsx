import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, Store } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import PurchaseBenefits from "@/components/product/PurchaseBenefits";
import PurchaseFaq from "@/components/product/PurchaseFaq";
import { productDetail as product, subscriptionProducts } from "@/data/products";
import { discountPercent, formatPrice } from "@/lib/format";

// O slug ainda não é lido: toda URL /produto/* mostra o mock de productDetail.
// Quando houver API, buscar pelo slug com `const { slug } = await props.params`
// (params é Promise no Next 16) e tipar com PageProps<"/produto/[slug]">.
export default function ProductDetailsPage() {
  const similarProducts = subscriptionProducts.slice(0, 4);
  const discount = discountPercent(product.oldPrice, product.price);

  return (
    <main className="product-page">
      <nav className="breadcrumb-wrap" aria-label="Você está em">
        <Link href="/">Home</Link>
        <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
        <span aria-current="page">{product.shortName}</span>
      </nav>

      <section className="product-hero">
        <div className="product-main-image">
          <Image
            src={product.image}
            alt={product.shortName}
            fill
            preload
            sizes="(max-width: 800px) 100vw, 50vw"
            className="detail-product-image"
          />
        </div>

        <div className="product-summary">
          <span className="stock-badge">• {product.stock} unidades em estoque</span>
          <h1>{product.name}</h1>

          <div className="price-row">
            <strong>{formatPrice(product.price)}</strong>
            <del>{formatPrice(product.oldPrice)}</del>
            {discount > 0 && <span className="discount-badge">-{discount}%</span>}
          </div>
          <p className="price-note">Pague com Pix ou cartão de crédito</p>

          <p className="product-description">{product.description}</p>

          <div className="product-actions">
            <Link href="/carrinho" className="add-cart-button">
              Adicionar ao Carrinho
            </Link>
            <Link href="/checkout" className="buy-now-button">Comprar</Link>
          </div>

          <div className="delivery-status">
            <div className="delivery-icon" aria-hidden="true"><Store size={24} strokeWidth={1.4} /></div>
            <div>
              <span>Em Estoque</span>
              <strong>Hoje</strong>
            </div>
          </div>

          <PurchaseBenefits variant="list" />
        </div>
      </section>

      <section className="details-section">
        <div className="details-card">
          <h2>Detalhes do Produto</h2>
          <p className="details-intro">{product.description}</p>

          <h3>Detalhes</h3>
          <dl className="product-specs">
            {product.specs.map((spec) => (
              <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>
            ))}
          </dl>

          <h3 className="how-title">Como funciona, passo a passo</h3>
          <div className="steps">
            {product.steps.map((step) => (
              <article key={step.title}>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </article>
            ))}
          </div>

          <h3 className="how-title">Perguntas frequentes</h3>
          <PurchaseFaq />

          <button type="button" className="see-more-button">
            Ver Mais
            <ChevronDown size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="similar-section">
        <h2>Produtos Similares</h2>
        <div className="product-grid similar-grid">
          {similarProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
