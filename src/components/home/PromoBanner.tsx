import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="promo-banner" aria-labelledby="promo-title">
      <Image src="/assets/summer-sale.jpg" alt="" fill sizes="100vw" />
      <div className="promo-overlay">
        <h2 id="promo-title">Big Summer <strong>Sale</strong></h2>
        <p>Commodo fames vitae vitae leo mauris in. Eu consequat.</p>
        <button type="button">Shop Now</button>
      </div>
    </section>
  );
}
