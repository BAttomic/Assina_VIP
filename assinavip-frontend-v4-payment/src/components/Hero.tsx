import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-top">
        <button className="hero-arrow left" aria-label="Banner anterior"><ChevronLeft size={18} /></button>
        <div className="hero-card hero-card-large">
          <Image src="/assets/spotify-banner.jpg" alt="Spotify com até 70% off" fill priority sizes="(max-width: 900px) 100vw, 63vw" />
        </div>
        <div className="hero-card hero-card-side">
          <Image src="/assets/netflix-banner.jpg" alt="Netflix com desconto" fill sizes="(max-width: 900px) 100vw, 37vw" />
        </div>
        <button className="hero-arrow right" aria-label="Próximo banner"><ChevronRight size={18} /></button>
      </div>

      <div className="hero-wide">
        <Image src="/assets/intel-banner.jpg" alt="Trabalhe inteligente e criação inovadora" fill sizes="100vw" />
        <div className="hero-dots" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span /><span className="active" /><span /><span />
        </div>
        <button className="wide-arrow left" aria-label="Banner anterior"><ChevronLeft size={17} /></button>
        <button className="wide-arrow right" aria-label="Próximo banner"><ChevronRight size={17} /></button>
      </div>
    </section>
  );
}
