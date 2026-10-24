import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import ProductSection from "@/components/home/ProductSection";
import PromoBanner from "@/components/home/PromoBanner";
import PurchaseBenefits from "@/components/product/PurchaseBenefits";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <PurchaseBenefits />
      <CategorySection />
      <ProductSection />
      <PromoBanner />
    </main>
  );
}
