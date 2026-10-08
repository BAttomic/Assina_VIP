import { subscriptionProducts, discountedProducts } from "../data/products";
import ProductCard from "./ProductCard";

export default function ProductSection() {
  return (
    <section className="products-area" id="produtos">
      <div className="product-tabs">
        <button className="active">Assinaturas</button>
        <button>Assinaturas Premium</button>
        <button>Mais Vendidos</button>
      </div>

      <div className="product-grid">
        {subscriptionProducts.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      <div className="discount-heading">Discounts up to -50%</div>
      <div className="product-grid discount-grid">
        {discountedProducts.map((product) => <ProductCard key={product.id} product={product} wishlist />)}
      </div>
    </section>
  );
}
