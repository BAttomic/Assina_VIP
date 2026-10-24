import Image from "next/image";
import Link from "next/link";
import { Heart, Zap } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

type Props = {
  product: Product;
  /** Mostra o botão de favoritar (usado na seção de descontos). */
  wishlist?: boolean;
};

export default function ProductCard({ product, wishlist = false }: Props) {
  const content = (
    <article className="product-card">
      {wishlist && <button type="button" className="wishlist" aria-label={`Adicionar ${product.name} aos favoritos`}><Heart size={24} strokeWidth={1.3} /></button>}
      <div className="product-image-wrap">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 560px) 112px, 160px" className="product-image" />
      </div>
      <div className="product-info">
        <p className="product-name">{product.name} |</p>
        <p className="product-duration">{product.duration}</p>
        <strong className="product-price">{formatPrice(product.price)}</strong>
        {/* Só assinaturas têm entrega automática; produtos físicos (iPhone, Galaxy...) não. */}
        {product.category === "Assinaturas" && (
          <span className="product-delivery"><Zap size={14} strokeWidth={2} aria-hidden="true" />Entrega automática</span>
        )}
        <button type="button" className="buy-button">Comprar Agora</button>
      </div>
    </article>
  );

  if (product.slug) {
    return <Link href={`/produto/${product.slug}`} className="product-card-link">{content}</Link>;
  }

  return content;
}
