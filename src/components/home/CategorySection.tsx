import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "@/data/categories";

export default function CategorySection() {
  return (
    <section className="categories-section" id="categorias">
      <div className="categories-inner">
        <div className="section-heading category-heading">
          <h2>Pesquise por Categoria</h2>
          <div className="section-arrows">
            <button type="button" aria-label="Categorias anteriores"><ChevronLeft size={24} strokeWidth={1.6} /></button>
            <button type="button" aria-label="Próximas categorias"><ChevronRight size={24} strokeWidth={1.6} /></button>
          </div>
        </div>
        <div className="category-list">
          {categories.map(({ slug, name, icon }) => (
            <Link href={`/categorias/${slug}`} className="category-card" key={slug}>
              <Image src={icon} alt="" width={48} height={48} />
              <span>{name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
