import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import ProductSection from "@/components/home/ProductSection";
import PromoBanner from "@/components/home/PromoBanner";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CategorySection />
      <ProductSection />
      <PromoBanner />
    </main>
  );
}
