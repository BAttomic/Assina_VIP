import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero" id="home">
      {/* Título da página para leitores de tela e buscadores. O Figma não tem título visível na Home. */}
      <h1 className="hero-title">AssinaVip: assinaturas digitais, jogos e produtos com entrega automática</h1>
      <div className="hero-top">
        <button type="button" className="hero-arrow left" aria-label="Banner anterior"><ChevronLeft size={18} strokeWidth={2} /></button>
        <div className="hero-card hero-card-large">
          <Image src="/assets/spotify-banner.jpg" alt="Spotify com até 70% off" fill preload sizes="(max-width: 900px) 100vw, 63vw" />
        </div>
        <div className="hero-card hero-card-side">
          <Image src="/assets/netflix-banner.jpg" alt="Netflix com desconto" fill sizes="(max-width: 900px) 100vw, 63vw" />
        </div>
        <button type="button" className="hero-arrow right" aria-label="Próximo banner"><ChevronRight size={18} strokeWidth={2} /></button>
      </div>

      <div className="hero-wide">
        <Image src="/assets/intel-banner.jpg" alt="Trabalhe inteligente e criação inovadora" fill sizes="(max-width: 1400px) 100vw, 1365px" />
        <div className="hero-dots" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span /><span className="active" /><span /><span />
        </div>
        <button type="button" className="wide-arrow left" aria-label="Banner anterior"><ChevronLeft size={22} strokeWidth={2} /></button>
        <button type="button" className="wide-arrow right" aria-label="Próximo banner"><ChevronRight size={22} strokeWidth={2} /></button>
      </div>
    </section>
  );
}
