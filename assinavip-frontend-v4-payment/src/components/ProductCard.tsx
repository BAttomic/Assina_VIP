import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "../data/products";

function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export default function ProductCard({ product, wishlist = false }: { product: Product; wishlist?: boolean }) {
  const content = (
    <article className="product-card">
      {wishlist && <button className="wishlist" aria-label={`Adicionar ${product.name} aos favoritos`}><Heart size={16} strokeWidth={1.2} /></button>}
      <div className="product-image-wrap">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 42vw, 220px" className="product-image" />
      </div>
      <div className="product-info">
        <p className="product-name">{product.name} |</p>
        <p className="product-duration">{product.duration}</p>
        <strong className="product-price">${formatPrice(product.price)}</strong>
        <button className="buy-button">Comprar Agora</button>
      </div>
    </article>
  );

  if (product.id === "netflix-30") {
    return <Link href="/produto/netflix-premium" className="product-card-link">{content}</Link>;
  }

  return content;
}
