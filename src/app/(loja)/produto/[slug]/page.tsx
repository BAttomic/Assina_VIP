import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { productDetail as product, subscriptionProducts } from "@/data/products";
import { formatPriceCompact } from "@/lib/format";

// O slug ainda não é lido: toda URL /produto/* mostra o mock de productDetail.
// Quando houver API, buscar pelo slug com `const { slug } = await props.params`
// (params é Promise no Next 16) e tipar com PageProps<"/produto/[slug]">.
export default function ProductDetailsPage() {
  const similarProducts = subscriptionProducts.slice(0, 4);

  return (
    <main className="product-page">
      <div className="breadcrumb-wrap">
        <Link href="/">Home</Link>
        <ChevronRight size={13} strokeWidth={1.4} />
        <span>{product.shortName}</span>
      </div>

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
            <strong>{formatPriceCompact(product.price)}</strong>
            <del>{formatPriceCompact(product.oldPrice)}</del>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-actions">
            <Link href="/carrinho" className="add-cart-button">
              <ShoppingBag size={15} strokeWidth={1.5} />
              Adicionar ao Carrinho
            </Link>
            <Link href="/checkout" className="buy-now-button">Comprar</Link>
          </div>

          <div className="delivery-status">
            <div className="delivery-icon"><ShoppingBag size={17} strokeWidth={1.4} /></div>
            <div>
              <strong>Em Estoque</strong>
              <span>Hoje</span>
            </div>
          </div>
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

          <button className="see-more-button">
            Ver Mais
            <ChevronDown size={14} strokeWidth={1.4} />
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
