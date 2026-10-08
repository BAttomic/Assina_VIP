import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, ShoppingBag } from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ProductCard from "../../../components/ProductCard";
import { subscriptionProducts } from "../../../data/products";

const product = {
  name: "NETFLIX PREMIUM 4K ULTRA HD | 30 DIAS",
  shortName: "Netflix Premium",
  image: "/assets/netflix.jpg",
  price: 13.99,
  oldPrice: 14.99,
  stock: 8,
  description:
    "Acesso premium à plataforma nº 1 de filmes e séries, com a melhor qualidade disponível.",
};

export default function ProductDetailsPage() {
  const similarProducts = subscriptionProducts.slice(0, 4);

  return (
    <>
      <Header />
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
              alt="Netflix Premium"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 50vw"
              className="detail-product-image"
            />
          </div>

          <div className="product-summary">
            <span className="stock-badge">• {product.stock} unidades em estoque</span>
            <h1>{product.name}</h1>

            <div className="price-row">
              <strong>${product.price.toFixed(2).replace(".", "")}</strong>
              <del>${product.oldPrice.toFixed(2).replace(".", "")}</del>
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
              <div><dt>Formato</dt><dd>Credenciais de acesso</dd></div>
              <div><dt>Entrega</dt><dd>Automática</dd></div>
              <div><dt>Acesso</dt><dd>Perfil exclusivo</dd></div>
              <div><dt>Garantia</dt><dd>30 dias</dd></div>
            </dl>

            <h3 className="how-title">Como funciona, passo a passo</h3>
            <div className="steps">
              <article>
                <h4>Receba as credenciais de acesso</h4>
                <p>Após a confirmação do pagamento, você recebe automaticamente o login e a senha da conta.</p>
              </article>
              <article>
                <h4>Acesse a Netflix e selecione seu perfil</h4>
                <p>Entre com as credenciais recebidas e escolha o seu perfil individual para começar a usar.</p>
              </article>
              <article>
                <h4>Aproveite filmes e séries em 4K</h4>
                <p>Curta todo o catálogo da Netflix em Ultra HD durante 30 dias corridos a partir da entrega das credenciais.</p>
              </article>
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
      <Footer />
    </>
  );
}
