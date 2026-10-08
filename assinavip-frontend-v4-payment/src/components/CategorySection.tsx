import { ChevronLeft, ChevronRight, Crown, Gamepad2, Package, Store, Twitch } from "lucide-react";

const categories = [
  { label: "Os Mais Desejados", icon: Crown },
  { label: "Xbox e Microsoft Store", icon: Store },
  { label: "Twitch Drops", icon: Twitch },
  { label: "Assinaturas", icon: Package },
  { label: "Jogos", icon: Gamepad2 },
];

export default function CategorySection() {
  return (
    <section className="categories-section" id="categorias">
      <div className="section-heading category-heading">
        <h2>Pesquise por Categoria</h2>
        <div className="section-arrows">
          <button aria-label="Categorias anteriores"><ChevronLeft size={17} /></button>
          <button aria-label="Próximas categorias"><ChevronRight size={17} /></button>
        </div>
      </div>
      <div className="category-list">
        {categories.map(({ label, icon: Icon }) => (
          <button className="category-card" key={label}>
            <Icon size={26} strokeWidth={1.45} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
