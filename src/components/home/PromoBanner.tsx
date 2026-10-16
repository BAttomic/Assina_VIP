import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="promo-banner">
      <Image src="/assets/summer-sale.jpg" alt="Big Summer Sale" fill sizes="100vw" />
      <div className="promo-overlay">
        <p>Commodo fames vitae vitae leo mauris in. Eu consequat.</p>
        <button>Shop Now</button>
      </div>
    </section>
  );
}
