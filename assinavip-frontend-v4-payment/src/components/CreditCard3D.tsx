"use client";

import { useEffect, useRef, useState } from "react";
import type { CardFace, CardScene } from "./creditCardScene";

type Props = {
  /** Texto exibido no cartão (já formatado/mascarado pela página). */
  number: string;
  holder: string;
  expiry: string;
  /** "back" vira o cartão para o verso (use quando o CVV estiver em foco). */
  side?: "front" | "back";
  /** Distância da câmera: menor = cartão maior no quadro (padrão 2.55). Só é lido na montagem. */
  distance?: number;
};

/**
 * Cartão 3D em Three.js. Ocupa 100% da largura/altura do elemento pai,
 * então o pai precisa ter altura definida (o .card-stage-inner já deve ter).
 * O Three.js só é carregado no navegador, dentro do useEffect (nada roda no servidor).
 */
export default function CreditCard3D({ number, holder, expiry, side = "front", distance }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<CardScene | null>(null);
  const [failed, setFailed] = useState(false);

  // Valores mais recentes numa ref: a cena, ao terminar de carregar, nunca usa dados velhos.
  const latest = useRef({ face: { number, holder, expiry } as CardFace, side });
  latest.current = { face: { number, holder, expiry }, side };

  useEffect(() => {
    let disposed = false;
    let scene: CardScene | undefined;

    (async () => {
      const { createCardScene } = await import("./creditCardScene");
      const el = containerRef.current;
      if (!el || disposed) return;
      scene = createCardScene(el, latest.current.face, {
        initialSide: latest.current.side,
        distance,
      });
      sceneRef.current = scene;
    })().catch((error) => {
      console.error("Falha ao iniciar o cartão 3D:", error);
      if (!disposed) setFailed(true);
    });

    return () => {
      disposed = true;
      sceneRef.current = null;
      scene?.dispose();
    };
    // a cena é criada uma vez; texto e lado chegam pelos efeitos abaixo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sceneRef.current?.setFace({ number, holder, expiry });
  }, [number, holder, expiry]);

  useEffect(() => {
    sceneRef.current?.setSide(side);
  }, [side]);

  if (failed) {
    // Sem WebGL: mostra um cartão simples para o checkout continuar utilizável.
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "min(320px, 90%)",
            aspectRatio: "1.586",
            borderRadius: 16,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 6,
            background: "#0e0f14",
            color: "#d0d6e2",
            fontFamily: "Menlo, Consolas, monospace",
          }}
        >
          <div style={{ fontSize: 18, letterSpacing: 1 }}>{number}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{expiry}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{holder}</div>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }} />;
}
