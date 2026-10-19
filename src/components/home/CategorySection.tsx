import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Ícones exportados do Figma (public/assets/icons). O do Xbox foi redesenhado a partir da geometria do Figma.
const categories = [
  { label: "Os Mais Desejados", icon: "/assets/icons/category-most-wanted.svg" },
  { label: "Xbox e Microsoft Store", icon: "/assets/icons/category-xbox.svg" },
  { label: "Twitch Drops", icon: "/assets/icons/category-twitch.svg" },
  { label: "Assinaturas", icon: "/assets/icons/category-subscriptions.svg" },
  { label: "Jogos", icon: "/assets/icons/category-games.svg" },
];

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
          {categories.map(({ label, icon }) => (
            <button type="button" className="category-card" key={label}>
              <Image src={icon} alt="" width={48} height={48} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
