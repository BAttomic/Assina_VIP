// @ts-nocheck — porte direto do demo em JS puro (index.html). A API pública abaixo é tipada.
/* eslint-disable */
/**
 * Cena 3D do cartão (Three.js r128 — use exatamente three@0.128.0).
 * Portada do index.html: agora vive dentro de um container (não da janela toda),
 * aceita texto dinâmico, gira para o verso sob demanda e limpa tudo no dispose().
 *
 * Só importe este arquivo no navegador (o CreditCard3D.tsx já faz isso via import dinâmico).
 */
import * as THREE from "three";

export type CardFace = {
  /** texto exibido no cartão, ex.: "5412 7512 3412 4291" (ou mascarado) */
  number: string;
  /** ex.: "12/28" */
  expiry: string;
  /** ex.: "NOME DO TITULAR" */
  holder: string;
};

export type CardSceneOptions = {
  /** distância da câmera; menor = cartão maior no quadro (padrão 2.55). Em quadros estreitos ela aumenta sozinha para o cartão caber. */
  distance?: number;
  /** zoom com a roda do mouse (padrão false, para não brigar com o scroll da página) */
  enableZoom?: boolean;
  initialSide?: "front" | "back";
};

export type CardScene = {
  setFace(face: CardFace): void;
  setSide(side: "front" | "back"): void;
  dispose(): void;
};

/* Marca e textos fixos do cartão. Troque aqui (e o LOGO_PATH abaixo) para usar a sua marca. */
export const BRAND = {
  wordmark: "Jeezus",
  tier: "BLACK",
  tagline: "JeezusDesign.",
  url: "jeezus.ai/black",
};

export function createCardScene(
  container: HTMLElement,
  initialFace: CardFace,
  opts: CardSceneOptions = {}
): CardScene {
const DISTANCE = opts.distance ?? 2.55;
const size = () => ({
  w: Math.max(1, container.clientWidth),
  h: Math.max(1, container.clientHeight),
});
let { w: VW, h: VH } = size();


/* ════════════════════════════════════════════════════════════════════
   CLAUDE STARBURST — official mark geometry (16×16 viewBox)
   ════════════════════════════════════════════════════════════════════ */
const LOGO_PATH = "m3.127 10.604 3.135-1.76.053-.153-.053-.085H6.11l-.525-.032-1.791-.048-1.554-.065-1.505-.08-.38-.081L0 7.832l.036-.234.32-.214.455.04 1.009.069 1.513.105 1.097.064 1.626.17h.259l.036-.105-.089-.065-.068-.064-1.566-1.062-1.695-1.121-.887-.646-.48-.327-.243-.306-.104-.67.435-.48.585.04.15.04.593.456 1.267.981 1.654 1.218.242.202.097-.068.012-.049-.109-.181-.9-1.626-.96-1.655-.428-.686-.113-.411a2 2 0 0 1-.068-.484l.496-.674L4.446 0l.662.089.279.242.411.94.666 1.48 1.033 2.014.302.597.162.553.06.17h.105v-.097l.085-1.134.157-1.392.154-1.792.052-.504.25-.605.497-.327.387.186.319.456-.045.294-.19 1.23-.37 1.93-.243 1.29h.142l.161-.16.654-.868 1.097-1.372.484-.545.565-.601.363-.287h.686l.505.751-.226.775-.707.895-.585.759-.839 1.13-.524.904.048.072.125-.012 1.897-.403 1.024-.186 1.223-.21.553.258.06.263-.218.536-1.307.323-1.533.307-2.284.54-.028.02.032.04 1.029.098.44.024h1.077l2.005.15.525.346.315.424-.053.323-.807.411-3.631-.863-.872-.218h-.12v.073l.726.71 1.331 1.202 1.667 1.55.084.383-.214.302-.226-.032-1.464-1.101-.565-.497-1.28-1.077h-.084v.113l.295.432 1.557 2.34.08.718-.112.234-.404.141-.444-.08-.911-1.28-.94-1.44-.759-1.291-.093.053-.448 4.821-.21.246-.484.186-.403-.307-.214-.496.214-.98.258-1.28.21-1.016.19-1.263.112-.42-.008-.028-.092.012-.953 1.307-1.448 1.957-1.146 1.227-.274.109-.477-.247.045-.44.266-.39 1.586-2.018.956-1.25.617-.723-.004-.105h-.036l-4.212 2.736-.75.096-.324-.302.04-.496.154-.162 1.267-.871z";
const logoPath2D = new Path2D(LOGO_PATH);

function drawLogo(ctx, x, y, size, fill, rotDeg = 0) {
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate(rotDeg * Math.PI / 180);
  ctx.translate(-size / 2, -size / 2);
  ctx.scale(size / 16, size / 16);
  ctx.fillStyle = fill;
  ctx.fill(logoPath2D);
  ctx.restore();
}

/* ════════════════════════════════════════════════════════════════════
   RENDERER
   ════════════════════════════════════════════════════════════════════ */
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab;touch-action:pan-y;user-select:none;-webkit-user-select:none;outline:none;';
container.appendChild(canvas);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
const DPR = Math.min(window.devicePixelRatio || 1, 2);
renderer.setPixelRatio(DPR);
renderer.setSize(VW, VH, false);
renderer.setClearColor(0x000000, 0); // fundo 100% transparente
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.02;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, VW / VH, 0.01, 100);
camera.position.set(0, 0, DISTANCE);

/* ════════════════════════════════════════════════════════════════════
   ENVIRONMENT — high contrast studio
   ════════════════════════════════════════════════════════════════════ */
function softEllipse(ctx, x, y, rx, ry, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(rx, ry);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0, color.replace('A', alpha.toFixed(3)));
  g.addColorStop(0.55, color.replace('A', (alpha * 0.4).toFixed(3)));
  g.addColorStop(1, color.replace('A', '0'));
  ctx.fillStyle = g;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}

function makeEnvironment() {
  const cv = document.createElement('canvas');
  cv.width = 2048; cv.height = 1024;
  const ctx = cv.getContext('2d');

  const base = ctx.createLinearGradient(0, 0, 0, 1024);
  base.addColorStop(0,   '#15161a');
  base.addColorStop(0.5, '#0a0a0d');
  base.addColorStop(1,   '#030304');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 2048, 1024);

  // KEY — tall window softbox (vertical! → long vertical highlights on card)
  ctx.save();
  ctx.filter = 'blur(26px)';
  const win = ctx.createLinearGradient(480, 0, 760, 0);
  win.addColorStop(0, 'rgba(230,238,252,0)');
  win.addColorStop(0.5, 'rgba(240,246,255,0.96)');
  win.addColorStop(1, 'rgba(230,238,252,0)');
  ctx.fillStyle = win;
  ctx.fillRect(460, 110, 320, 620);
  ctx.restore();
  // hot core of the window
  ctx.save();
  ctx.filter = 'blur(12px)';
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.fillRect(560, 200, 120, 420);
  ctx.restore();

  // RIM — thin warm blade, right rear
  ctx.save();
  ctx.filter = 'blur(14px)';
  const strip = ctx.createLinearGradient(1530, 0, 1610, 0);
  strip.addColorStop(0, 'rgba(255,232,200,0)');
  strip.addColorStop(0.5, 'rgba(255,236,206,0.95)');
  strip.addColorStop(1, 'rgba(255,232,200,0)');
  ctx.fillStyle = strip;
  ctx.fillRect(1510, 140, 110, 660);
  ctx.restore();

  // cold sliver far left
  softEllipse(ctx, 130, 430, 40, 150, 'rgba(190,210,240,A)', 0.55);

  const tex = new THREE.CanvasTexture(cv);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.encoding = THREE.sRGBEncoding;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envMap = pmrem.fromEquirectangular(tex).texture;
  pmrem.dispose();
  tex.dispose();
  return envMap;
}

scene.environment = makeEnvironment();

/* ════════════════════════════════════════════════════════════════════
   LIGHTS — window rig instead of a point.
   Six weak directionals arranged on a rectangle = one soft area source.
   The card's face never sees a point highlight again.
   ════════════════════════════════════════════════════════════════════ */
const windowRig = [];
const RIG_CENTER = new THREE.Vector3(-3.0, 3.4, 3.0);
const RIG_U = new THREE.Vector3(1.35, 0, -0.45);  // width axis
const RIG_V = new THREE.Vector3(0, 1.05, 0.35);   // height axis
const rigOffsets = [
  [-1, -0.5], [0, -0.5], [1, -0.5],
  [-1,  0.5], [0,  0.5], [1,  0.5],
];
for (const [u, v] of rigOffsets) {
  const l = new THREE.DirectionalLight(0xdce8fa, 0.55);
  l.position.copy(RIG_CENTER)
    .addScaledVector(RIG_U, u)
    .addScaledVector(RIG_V, v);
  scene.add(l);
  windowRig.push({ light: l, u, v });
}

const rimLight = new THREE.DirectionalLight(0xffe8d2, 1.5);
rimLight.position.set(4.5, -1.8, -2);
scene.add(rimLight);

// sweep: narrow, grazing — touches only the polished edge
const sweep = new THREE.SpotLight(0xffffff, 9, 22, Math.PI / 20, 0.95, 2);
sweep.position.set(4.2, 1.2, 1.4);
scene.add(sweep);
scene.add(sweep.target);
sweep.target.position.set(0, 0.12, 0);

/* ════════════════════════════════════════════════════════════════════
   HEIGHTMAP → NORMAL
   ════════════════════════════════════════════════════════════════════ */
function heightToNormal(src, strength = 2.2, out = document.createElement('canvas')) {
  const w = src.width, h = src.height;
  const sd = src.getContext('2d').getImageData(0, 0, w, h).data;
  if (out.width !== w) out.width = w;
  if (out.height !== h) out.height = h;
  const octx = out.getContext('2d');
  const oimg = octx.createImageData(w, h);
  const od = oimg.data;

  const H = (x, y) => {
    x = Math.max(0, Math.min(w - 1, x));
    y = Math.max(0, Math.min(h - 1, y));
    return sd[(y * w + x) * 4] / 255;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (H(x - 1, y) - H(x + 1, y)) * strength;
      const dy = (H(x, y - 1) - H(x, y + 1)) * strength;
      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const i = (y * w + x) * 4;
      od[i]     = (dx / len * 0.5 + 0.5) * 255;
      od[i + 1] = (dy / len * 0.5 + 0.5) * 255;
      od[i + 2] = (1  / len * 0.5 + 0.5) * 255;
      od[i + 3] = 255;
    }
  }
  octx.putImageData(oimg, 0, 0);
  return out;
}

const TW = 816, TH = 512; // cartão deitado (proporção ≈ 1.59, como um cartão real)
const SILVER = 'rgba(208,214,226,0.95)';
const SILVER_DIM = 'rgba(196,202,214,0.78)';
const MONO = '"SF Mono", Menlo, Consolas, monospace';
const MARGIN = 54;

// Textos do formulário em relevo (pegam a luz). No demo original eram preto sobre preto,
// bonito de foto mas ilegível para quem está digitando o cartão.
const EMBOSS_TEXT = true;

function spacedText(ctx, text, x, y, gap) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + gap;
  }
}
function spacedWidth(ctx, text, gap) {
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + gap;
  return w - gap;
}

// Marca no canto inferior direito: wordmark serifado + nível (BLACK) alinhados à direita.
function drawLockup(ctx, fill, tierFill) {
  const right = TW - MARGIN;

  ctx.save();
  ctx.font = 'normal 38px Georgia, "Times New Roman", serif';
  const ww = spacedWidth(ctx, BRAND.wordmark, -0.5) * 0.97;
  ctx.translate(right - ww, 446);
  ctx.scale(0.97, 1);
  ctx.fillStyle = fill;
  spacedText(ctx, BRAND.wordmark, 0, 0, -0.5);
  ctx.restore();

  ctx.save();
  ctx.font = '600 13px "Manrope", "Helvetica Neue", Arial, sans-serif';
  const tw = spacedWidth(ctx, BRAND.tier, 7);
  ctx.fillStyle = tierFill;
  spacedText(ctx, BRAND.tier, right - tw, 474, 7);
  ctx.restore();
}

function clipRounded(c) {
  const cr = 40; // raio da geometria (RADIUS × pixels por unidade ≈ 40px)
  c.beginPath();
  c.moveTo(cr, 0);
  c.lineTo(TW - cr, 0); c.quadraticCurveTo(TW, 0, TW, cr);
  c.lineTo(TW, TH - cr); c.quadraticCurveTo(TW, TH, TW - cr, TH);
  c.lineTo(cr, TH); c.quadraticCurveTo(0, TH, 0, TH - cr);
  c.lineTo(0, cr); c.quadraticCurveTo(0, 0, cr, 0);
  c.closePath();
  c.clip();
}

/* ════════════════════════════════════════════════════════════════════
   FRONT SKIN — color + normal + roughness.
   As camadas estáticas (logo, escovado, grid, arranhões) são desenhadas
   uma única vez em canvases "base". O texto dinâmico (número, validade,
   titular) é redesenhado por cima quando o formulário muda.
   ════════════════════════════════════════════════════════════════════ */
function makeFrontSkin(initialFace) {
  const mk = (ctxOpts) => {
    const cv = document.createElement('canvas');
    cv.width = TW; cv.height = TH;
    return [cv, cv.getContext('2d', ctxOpts)];
  };

  /* HEIGHT base */
  const [hBase, hb] = mk();
  hb.fillStyle = '#000';
  hb.fillRect(0, 0, TW, TH);
  hb.filter = 'blur(1.2px)';
  drawLogo(hb, MARGIN - 2, 50, 64, '#fff');
  drawLockup(hb, '#fff', EMBOSS_TEXT ? '#fff' : '#000');

  /* COLOR base — opaque skin with rounded corners clipped */
  const [cBase, cb] = mk();
  cb.save();
  clipRounded(cb);
  cb.fillStyle = '#0e0f14';
  cb.fillRect(0, 0, TW, TH);
  drawLogo(cb, MARGIN - 2, 50, 64, SILVER);
  drawLockup(cb, SILVER, SILVER_DIM);
  cb.restore();

  /* ROUGHNESS base — the material storytelling layer */
  const [rBase, r] = mk();
  r.fillStyle = '#3d3d3d';
  r.fillRect(0, 0, TW, TH);

  // horizontal brushing
  for (let i = 0; i < 2400; i++) {
    const y = Math.random() * TH;
    const x = Math.random() * TW;
    const len = 60 + Math.random() * 260;
    const v = 44 + Math.floor(Math.random() * 36);
    r.strokeStyle = `rgba(${v},${v},${v},0.22)`;
    r.lineWidth = 0.6;
    r.beginPath();
    r.moveTo(x, y);
    r.lineTo(x + len, y + (Math.random() - 0.5) * 1.5);
    r.stroke();
  }

  // diagonal micro-grid — 45°, whisper-level
  r.save();
  r.translate(TW / 2, TH / 2);
  r.rotate(Math.PI / 4);
  r.strokeStyle = 'rgba(78,78,78,0.30)';
  r.lineWidth = 0.7;
  for (let d = -900; d < 900; d += 18) {
    r.beginPath();
    r.moveTo(d, -900);
    r.lineTo(d, 900);
    r.stroke();
  }
  r.restore();

  // micro scratches
  for (let i = 0; i < 14; i++) {
    const x = Math.random() * TW, y = Math.random() * TH;
    const a = Math.random() * Math.PI;
    const len = 25 + Math.random() * 90;
    r.strokeStyle = 'rgba(30,30,30,0.5)';
    r.lineWidth = 0.7;
    r.beginPath();
    r.moveTo(x, y);
    r.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    r.stroke();
  }

  /* working canvases (repintados a cada mudança de texto) */
  const [hcv, hctx] = mk({ willReadFrequently: true });
  const [ccv, cctx] = mk();
  const [rcv, rctx] = mk();
  const ncv = document.createElement('canvas');

  const putText = (ctx, face) => {
    ctx.font = `500 38px ${MONO}`;
    ctx.fillText(face.number, MARGIN, 322, TW - MARGIN * 2); // maxWidth evita estourar com 19 dígitos
    ctx.font = `400 18px ${MONO}`;
    ctx.fillText(face.expiry, MARGIN, 388);
    ctx.fillText(face.holder, MARGIN, 436, 420);
  };

  function paint(raw) {
    const face = {
      number: String(raw.number).replace(/ /g, '  '),
      expiry: String(raw.expiry).replace('/', ' / '),
      holder: String(raw.holder),
    };

    hctx.save();
    hctx.clearRect(0, 0, TW, TH);
    hctx.drawImage(hBase, 0, 0);
    if (EMBOSS_TEXT) {
      hctx.filter = 'blur(1.2px)';
      hctx.fillStyle = '#fff';
      putText(hctx, face);
    }
    hctx.restore();

    cctx.save();
    cctx.clearRect(0, 0, TW, TH);
    cctx.drawImage(cBase, 0, 0);
    cctx.fillStyle = 'rgba(214,220,232,0.92)'; // prata gravada, legível
    putText(cctx, face);
    cctx.restore();

    rctx.save();
    rctx.clearRect(0, 0, TW, TH);
    rctx.drawImage(rBase, 0, 0);
    rctx.filter = 'blur(0.8px)';
    rctx.fillStyle = '#6e6e6e'; // digits — matte: engraved areas scatter light
    putText(rctx, face);
    rctx.restore();

    heightToNormal(hcv, 2.6, ncv);
  }

  paint(initialFace);

  const maps = {
    color: new THREE.CanvasTexture(ccv),
    normal: new THREE.CanvasTexture(ncv),
    rough: new THREE.CanvasTexture(rcv),
  };

  return {
    maps,
    update(face) {
      paint(face);
      maps.color.needsUpdate = true;
      maps.normal.needsUpdate = true;
      maps.rough.needsUpdate = true;
    },
  };
}

/* ── BACK SKIN ──────────────────────────────────────────────────────── */
function makeBackMaps() {
  const MAG = { y: 62, h: 88 };                 // tarja magnética
  const SIG = { x: MARGIN, y: 206, w: 520, h: 54 }; // faixa de assinatura
  const LOGO = { x: TW / 2 - 24, y: 372, s: 48 };

  const hcv = document.createElement('canvas');
  hcv.width = TW; hcv.height = TH;
  const h = hcv.getContext('2d');
  h.fillStyle = '#000';
  h.fillRect(0, 0, TW, TH);
  h.filter = 'blur(1px)';
  h.fillStyle = '#777';
  h.fillRect(0, MAG.y, TW, MAG.h);
  h.filter = 'blur(1.2px)';
  drawLogo(h, LOGO.x, LOGO.y, LOGO.s, '#fff');

  const ccv = document.createElement('canvas');
  ccv.width = TW; ccv.height = TH;
  const c = ccv.getContext('2d');
  clipRounded(c);

  c.fillStyle = '#0e0f14';
  c.fillRect(0, 0, TW, TH);

  c.fillStyle = '#07080b';
  c.fillRect(0, MAG.y, TW, MAG.h);

  c.fillStyle = 'rgba(192,196,206,0.18)';
  c.fillRect(SIG.x, SIG.y, SIG.w, SIG.h);
  c.font = `400 16px ${MONO}`;
  c.fillStyle = 'rgba(222,226,234,0.62)';
  // "CVC •••" é só decorativo: o CVV digitado nunca vai para o cartão
  c.fillText('CVC •••', SIG.x + SIG.w + 32, SIG.y + SIG.h / 2 + 6);

  c.font = 'italic 24px Georgia, serif';
  c.fillStyle = 'rgba(214,220,230,0.34)';
  const inv = BRAND.tagline;
  c.fillText(inv, (TW - c.measureText(inv).width) / 2, 336);

  drawLogo(c, LOGO.x, LOGO.y, LOGO.s, 'rgba(204,210,222,0.7)');
  c.font = '400 12px "Manrope", sans-serif';
  c.fillStyle = 'rgba(190,196,208,0.30)';
  const url = BRAND.url;
  c.fillText(url, (TW - c.measureText(url).width) / 2, 470);

  const rcv = document.createElement('canvas');
  rcv.width = TW; rcv.height = TH;
  const r = rcv.getContext('2d');
  r.fillStyle = '#424242';
  r.fillRect(0, 0, TW, TH);
  // magstripe glossier
  r.fillStyle = '#1e1e1e';
  r.fillRect(0, MAG.y, TW, MAG.h);
  // signature strip rough
  r.fillStyle = '#787878';
  r.fillRect(SIG.x, SIG.y, SIG.w, SIG.h);
  for (let i = 0; i < 1600; i++) {
    const y = Math.random() * TH;
    const x = Math.random() * TW;
    const len = 60 + Math.random() * 220;
    const v = 48 + Math.floor(Math.random() * 34);
    r.strokeStyle = `rgba(${v},${v},${v},0.20)`;
    r.lineWidth = 0.6;
    r.beginPath();
    r.moveTo(x, y);
    r.lineTo(x + len, y);
    r.stroke();
  }

  return {
    color: new THREE.CanvasTexture(ccv),
    normal: new THREE.CanvasTexture(heightToNormal(hcv, 2.2)),
    rough: new THREE.CanvasTexture(rcv),
  };
}

/* ════════════════════════════════════════════════════════════════════
   CARD — real-card thinness. 0.8mm scale-true.
   ════════════════════════════════════════════════════════════════════ */
const CARD_W = 1.72, CARD_H = 1.08, CARD_D = 0.010, RADIUS = 0.085; // deitado
const BEVEL_THICKNESS = 0.003;
const FACE_OFFSET = CARD_D / 2 + BEVEL_THICKNESS + 0.0002;
const BASE_Y = 0.14;
const FLOOR_Y = -0.62;

function roundedCardShape(width = CARD_W, height = CARD_H, radius = RADIUS) {
  const s = new THREE.Shape();
  const x = -width / 2, y = -height / 2, w = width, h = height, r = radius;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);      s.quadraticCurveTo(x, y, x + r, y);
  s.closePath();
  return s;
}

function roundedCardGeometry() {
  const s = roundedCardShape();
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: CARD_D,
    bevelEnabled: true,
    bevelThickness: BEVEL_THICKNESS,
    bevelSize: 0.004,
    bevelSegments: 4,
    steps: 1,
  });
  geo.center();
  return geo;
}

// A true rounded face for the texture overlays. Unlike PlaneGeometry, this has
// no rectangular corner vertices that can poke beyond the card silhouette.
// Rebuilding normalized UVs keeps the artwork at its original scale.
function roundedFaceGeometry() {
  const geo = new THREE.ShapeGeometry(roundedCardShape(), 12);
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / CARD_W + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / CARD_H + 0.5;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}

/* iridescence — the whole card breathes blue→violet at extreme angles */
function addIridescence(mat, strength = 0.16) {
  mat.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
      {
        float irNdv = abs(dot(normalize(vNormal), normalize(vViewPosition)));
        float irF = pow(1.0 - irNdv, 3.0);
        vec3 irTint = mix(vec3(0.10, 0.16, 0.34), vec3(0.26, 0.10, 0.34), smoothstep(0.2, 0.9, irF));
        totalEmissiveRadiance += irTint * irF * ${strength.toFixed(3)};
      }`
    );
  };
}

const frontSkin = makeFrontSkin(initialFace);
const frontMaps = frontSkin.maps;
const faceMat = new THREE.MeshPhysicalMaterial({
  map: frontMaps.color,
  normalMap: frontMaps.normal,
  normalScale: new THREE.Vector2(1.2, 1.2),
  roughnessMap: frontMaps.rough,
  roughness: 1.0,
  metalness: 0.96,
  clearcoat: 1.0,
  clearcoatRoughness: 0.10,
  envMapIntensity: 2.6,
});
addIridescence(faceMat);

const backMaps = makeBackMaps();
const backFaceMat = new THREE.MeshPhysicalMaterial({
  map: backMaps.color,
  normalMap: backMaps.normal,
  roughnessMap: backMaps.rough,
  roughness: 1.0,
  metalness: 0.96,
  clearcoat: 1.0,
  clearcoatRoughness: 0.10,
  envMapIntensity: 2.6,
});
addIridescence(backFaceMat, 0.12);

const edgeMat = new THREE.MeshPhysicalMaterial({
  color: 0x15171e,
  metalness: 1.0,
  roughness: 0.06,
  clearcoat: 1.0,
  clearcoatRoughness: 0.04,
  envMapIntensity: 3.2,
});

const cardGroup = new THREE.Group();
cardGroup.position.y = BASE_Y;
scene.add(cardGroup);

const card = new THREE.Mesh(roundedCardGeometry(), [faceMat, edgeMat]);
cardGroup.add(card);

// front overlay — alphaTest clips transparent corners, fits inside bevel
const frontOverlayMat = new THREE.MeshPhysicalMaterial({
  map: frontMaps.color,
  normalMap: frontMaps.normal,
  normalScale: new THREE.Vector2(1.2, 1.2),
  roughnessMap: frontMaps.rough,
  roughness: 1.0,
  metalness: 0.95,
  clearcoat: 1.0,
  clearcoatRoughness: 0.10,
  envMapIntensity: 2.6,
  transparent: true,
  alphaTest: 0.01,
  depthWrite: false,
});
addIridescence(frontOverlayMat);
const faceOverlayGeometry = roundedFaceGeometry();
const front = new THREE.Mesh(faceOverlayGeometry, frontOverlayMat);
front.position.z = FACE_OFFSET;
cardGroup.add(front);

// back overlay
const backOverlayMat = new THREE.MeshPhysicalMaterial({
  map: backMaps.color,
  normalMap: backMaps.normal,
  roughnessMap: backMaps.rough,
  roughness: 1.0,
  metalness: 0.95,
  clearcoat: 1.0,
  clearcoatRoughness: 0.10,
  envMapIntensity: 2.6,
  transparent: true,
  alphaTest: 0.01,
  depthWrite: false,
});
addIridescence(backOverlayMat, 0.12);
const back = new THREE.Mesh(faceOverlayGeometry, backOverlayMat);
back.position.z = -FACE_OFFSET;
back.rotation.y = Math.PI;
cardGroup.add(back);

/* ── holographic seal ──────────────────────────────────────────────── */
const holoMat = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  depthTest: false,
  uniforms: { uTime: { value: 0 } },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormalW;
    varying vec3 vViewW;
    void main() {
      vUv = uv;
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vNormalW = normalize(mat3(modelMatrix) * normal);
      vViewW = normalize(cameraPosition - wp.xyz);
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormalW;
    varying vec3 vViewW;
    uniform float uTime;
    void main() {
      vec2 c = vUv - 0.5;
      float d = length(c);
      if (d > 0.5) discard;
      float fres = pow(1.0 - abs(dot(normalize(vNormalW), normalize(vViewW))), 1.5);
      float phase = fres * 4.2 + vUv.x * 2.0 + vUv.y * 1.2 + uTime * 0.10;
      vec3 spectrum = 0.5 + 0.5 * cos(6.28318 * (phase + vec3(0.0, 0.33, 0.67)));
      vec3 col = mix(vec3(0.72, 0.74, 0.78), spectrum, clamp(fres * 1.6, 0.0, 0.85));
      col *= 0.92 + 0.08 * sin(d * 260.0 + atan(c.y, c.x) * 3.0);
      float edge = smoothstep(0.5, 0.44, d);
      // Keep the seal continuously visible head-on. Fresnel still changes its
      // colour and sheen, but no longer drives opacity from faint to bright.
      float visibility = 0.44 + fres * 0.24;
      gl_FragColor = vec4(col, edge * visibility);
    }
  `,
});
const holo = new THREE.Mesh(new THREE.CircleGeometry(0.082, 48), holoMat);
holo.position.set(0.664, 0.367, FACE_OFFSET + 0.001);
holo.renderOrder = 4;
cardGroup.add(holo);

/* ── sombra de contato (único elemento do "chão") ── */
function makeShadowTexture() {
  const cv = document.createElement('canvas');
  cv.width = 256; cv.height = 128;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(128, 64, 0, 128, 64, 120);
  g.addColorStop(0, 'rgba(0,0,0,0.62)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.22)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.save();
  ctx.translate(128, 64);
  ctx.scale(1, 0.5);
  ctx.translate(-128, -64);
  ctx.fillRect(0, 0, 256, 128);
  ctx.restore();
  return new THREE.CanvasTexture(cv);
}

const shadow = new THREE.Mesh(
  new THREE.PlaneGeometry(2.6, 1.2),
  new THREE.MeshBasicMaterial({ map: makeShadowTexture(), transparent: true, depthWrite: false })
);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = FLOOR_Y + 0.005;
scene.add(shadow);

/* ════════════════════════════════════════════════════════════════════
   POST — bloom + composite com DoF leve, CA, grain (saída com alpha)
   ════════════════════════════════════════════════════════════════════ */
function makeSceneRT(w, h) {
  let rt;
  if (renderer.capabilities.isWebGL2 && THREE.WebGLMultisampleRenderTarget) {
    rt = new THREE.WebGLMultisampleRenderTarget(w, h);
    rt.samples = 4;
  } else {
    rt = new THREE.WebGLRenderTarget(w, h);
  }
  rt.texture.encoding = THREE.sRGBEncoding;
  rt.texture.minFilter = THREE.LinearFilter;
  rt.texture.magFilter = THREE.LinearFilter;
  return rt;
}
function makePlainRT(w, h) {
  const rt = new THREE.WebGLRenderTarget(w, h);
  rt.texture.encoding = THREE.sRGBEncoding;
  rt.texture.minFilter = THREE.LinearFilter;
  rt.texture.magFilter = THREE.LinearFilter;
  return rt;
}

let W = Math.floor(VW * DPR), H = Math.floor(VH * DPR);
let rtScene = makeSceneRT(W, H);
let rtBloom = makePlainRT(Math.floor(W / 4), Math.floor(H / 4));

const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const quadGeo = new THREE.PlaneGeometry(2, 2);

const bloomMat = new THREE.ShaderMaterial({
  uniforms: {
    tScene: { value: rtScene.texture },
    uTexel: { value: new THREE.Vector2(4 / W, 4 / H) },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.);} `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tScene;
    uniform vec2 uTexel;
    vec3 bp(vec2 uv){ return max(texture2D(tScene, uv).rgb - 0.62, 0.0); }
    void main(){
      vec3 a = vec3(0.0);
      a += bp(vUv) * 0.20;
      a += bp(vUv + uTexel * vec2( 1.5,  0.5)) * 0.10;
      a += bp(vUv + uTexel * vec2(-1.5, -0.5)) * 0.10;
      a += bp(vUv + uTexel * vec2( 0.5, -1.5)) * 0.10;
      a += bp(vUv + uTexel * vec2(-0.5,  1.5)) * 0.10;
      a += bp(vUv + uTexel * vec2( 3.0,  1.0)) * 0.075;
      a += bp(vUv + uTexel * vec2(-3.0, -1.0)) * 0.075;
      a += bp(vUv + uTexel * vec2( 1.0, -3.0)) * 0.075;
      a += bp(vUv + uTexel * vec2(-1.0,  3.0)) * 0.075;
      a += bp(vUv + uTexel * vec2( 5.0,  0.0)) * 0.05;
      a += bp(vUv + uTexel * vec2(-5.0,  0.0)) * 0.05;
      a += bp(vUv + uTexel * vec2( 0.0,  5.0)) * 0.04;
      a += bp(vUv + uTexel * vec2( 0.0, -5.0)) * 0.04;
      gl_FragColor = vec4(a, 1.0);
    }
  `,
});
const bloomScene = new THREE.Scene();
bloomScene.add(new THREE.Mesh(quadGeo, bloomMat));

const finalMat = new THREE.ShaderMaterial({
  uniforms: {
    tScene: { value: rtScene.texture },
    tBloom: { value: rtBloom.texture },
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(W, H) },
    uAspect: { value: W / H },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.);} `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tScene;
    uniform sampler2D tBloom;
    uniform float uTime;
    uniform vec2 uRes;
    uniform float uAspect;

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    void main(){
      vec2 uv = vUv;
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);

      // DoF — disco radial bem leve (o texto do cartão precisa ficar nítido)
      float ef = smoothstep(0.28, 0.92, length(c * vec2(uAspect, 1.0)) * 1.15);
      float rad = ef * 1.6;
      vec2 px = rad / uRes;

      // O RT guarda cor pré-multiplicada + alpha; o mesmo blur vale para os dois.
      vec4 acc = texture2D(tScene, uv);
      acc += texture2D(tScene, uv + px * vec2( 1.0,  0.0));
      acc += texture2D(tScene, uv + px * vec2(-1.0,  0.0));
      acc += texture2D(tScene, uv + px * vec2( 0.0,  1.0));
      acc += texture2D(tScene, uv + px * vec2( 0.0, -1.0));
      acc += texture2D(tScene, uv + px * vec2( 0.7,  0.7));
      acc += texture2D(tScene, uv + px * vec2(-0.7,  0.7));
      acc += texture2D(tScene, uv + px * vec2( 0.7, -0.7));
      acc += texture2D(tScene, uv + px * vec2(-0.7, -0.7));
      acc /= 9.0;
      vec3 col = acc.rgb;
      float alpha = acc.a;

      // chromatic fringing (só nas bordas do quadro)
      float ca = 0.014 * r2;
      float fr = texture2D(tScene, uv + c * ca).r;
      float fb = texture2D(tScene, uv - c * ca).b;
      col.r = mix(col.r, fr, 0.55 * ef + 0.15);
      col.b = mix(col.b, fb, 0.55 * ef + 0.15);

      // bloom
      col += texture2D(tBloom, uv).rgb * 0.55;

      // grain — só onde há cartão/sombra
      float g = hash(uv * uRes * 0.5 + fract(uTime) * vec2(37.0, 17.0)) * 2.0 - 1.0;
      col += g * 0.015 * alpha;

      // filmic lift
      col = col * 0.985 + 0.0045 * alpha;

      // saída pré-multiplicada válida (rgb <= alpha): sem halo sobre o fundo da página
      col = clamp(col, 0.0, alpha);
      gl_FragColor = vec4(col, alpha);
    }
  `,
});
const finalScene = new THREE.Scene();
finalScene.add(new THREE.Mesh(quadGeo, finalMat));

/* ════════════════════════════════════════════════════════════════════
   INTERACTION
   ════════════════════════════════════════════════════════════════════ */
let disposed = false;
let visible = true;
let raf = 0;
let pendingFace = null;

let isDragging = false;
let prev = { x: 0, y: 0 };
let vel = { x: 0, y: 0 };
// hero pose: face + edge both visible — luxury photography angle
const HERO_X = 0.07, HERO_Y = -0.15;
let target = { x: HERO_X, y: HERO_Y };
let current = { x: HERO_X, y: HERO_Y };
let pointer = { x: 0, y: 0 };
// distância mínima para o cartão (1.72 de largura) caber sem cortar em quadros estreitos
const fitDistance = () => Math.max(DISTANCE, 4.4 / camera.aspect);
let camZ = fitDistance();
camera.position.z = camZ;

const cleanups = [];
const listen = (el, type, fn, options) => {
  el.addEventListener(type, fn, options);
  cleanups.push(() => el.removeEventListener(type, fn, options));
};

function onDown(x, y) {
  isDragging = true;
  prev = { x, y };
  canvas.style.cursor = 'grabbing';
}
function onMove(x, y) {
  pointer.x = (x / window.innerWidth) * 2 - 1;
  pointer.y = (y / window.innerHeight) * 2 - 1;
  if (!isDragging) return;
  const dx = x - prev.x, dy = y - prev.y;
  vel.y = dx * 0.011;
  vel.x = dy * 0.011;
  target.y += vel.y;
  target.x += vel.x;
  prev = { x, y };
}
function onUp() {
  isDragging = false;
  canvas.style.cursor = 'grab';
}

listen(canvas, 'mousedown', e => onDown(e.clientX, e.clientY));
listen(window, 'mousemove', e => onMove(e.clientX, e.clientY));
listen(window, 'mouseup', onUp);
listen(canvas, 'touchstart', e => { const t = e.touches[0]; if (t) onDown(t.clientX, t.clientY); }, { passive: true });
listen(window, 'touchmove', e => { const t = e.touches[0]; if (t) onMove(t.clientX, t.clientY); }, { passive: true });
listen(window, 'touchend', onUp);
listen(window, 'touchcancel', onUp);

function flip() {
  const flips = Math.round((target.y - HERO_Y) / Math.PI);
  target.y = (flips + 1) * Math.PI + HERO_Y;
  vel.y = 0;
}
listen(canvas, 'dblclick', flip);

let lastTap = 0;
listen(canvas, 'touchend', () => {
  const now = Date.now();
  if (now - lastTap < 300) flip();
  lastTap = now;
});

// zoom por scroll fica desligado por padrão: numa página de checkout ele brigaria com o scroll da página
if (opts.enableZoom) {
  listen(canvas, 'wheel', e => {
    camZ = Math.max(2.6, Math.min(8.0, camZ + e.deltaY * 0.004));
  }, { passive: true });
}

/* gira para a frente/verso mais próximo (ex.: verso enquanto o CVV está em foco) */
function setSide(side, instant = false) {
  const want = side === 'back' ? 1 : 0;
  const n = (target.y - HERO_Y) / Math.PI;
  const k = Math.round((n - want) / 2) * 2 + want;
  target.y = k * Math.PI + HERO_Y;
  vel.y = 0;
  if (instant) current.y = target.y;
}

function setFace(face) {
  pendingFace = face; // aplicado no próximo frame (no máx. 1 repintura por frame)
}

function resize() {
  const s = size();
  if (s.w === VW && s.h === VH) return;
  VW = s.w; VH = s.h;
  camera.aspect = VW / VH;
  camera.updateProjectionMatrix();
  camZ = fitDistance();
  renderer.setSize(VW, VH, false);
  W = Math.floor(VW * DPR); H = Math.floor(VH * DPR);
  rtScene.dispose(); rtBloom.dispose();
  rtScene = makeSceneRT(W, H);
  rtBloom = makePlainRT(Math.floor(W / 4), Math.floor(H / 4));
  bloomMat.uniforms.tScene.value = rtScene.texture;
  bloomMat.uniforms.uTexel.value.set(4 / W, 4 / H);
  finalMat.uniforms.tScene.value = rtScene.texture;
  finalMat.uniforms.tBloom.value = rtBloom.texture;
  finalMat.uniforms.uRes.value.set(W, H);
  finalMat.uniforms.uAspect.value = W / H;
}
const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(container);

// não gasta GPU quando o cartão está fora da tela
const visibilityObserver = new IntersectionObserver(entries => {
  visible = entries[entries.length - 1].isIntersecting;
});
visibilityObserver.observe(container);

/* ════════════════════════════════════════════════════════════════════
   INTRO
   ════════════════════════════════════════════════════════════════════ */
const INTRO_MS = 2600;
const t0 = performance.now();
const easeOut = x => 1 - Math.pow(1 - x, 3);


/* ════════════════════════════════════════════════════════════════════
   FRAME LOOP
   ════════════════════════════════════════════════════════════════════ */
const clock = new THREE.Clock();

function animate() {
  if (disposed) return;
  raf = requestAnimationFrame(animate);
  if (!visible) return;

  if (pendingFace) {
    frontSkin.update(pendingFace);
    pendingFace = null;
  }

  const t = clock.getElapsedTime();

  const k = Math.min(1, (performance.now() - t0) / INTRO_MS);
  const e = easeOut(k);

  renderer.toneMappingExposure = 0.02 + 1.16 * e;

  if (!isDragging) {
    vel.x *= 0.93;
    vel.y *= 0.93;
    target.x += vel.x;
    target.y += vel.y;

    const idleX = Math.sin(t * 0.32) * 0.038 + pointer.y * 0.07;
    const idleY = Math.cos(t * 0.26) * 0.052 + pointer.x * 0.09;

    current.x += (target.x + idleX - current.x) * 0.055;
    current.y += (target.y + idleY - current.y) * 0.055;
  } else {
    current.x += (target.x - current.x) * 0.3;
    current.y += (target.y - current.y) * 0.3;
  }

  const introSpin = (1 - e) * 2.6;
  const introDrop = (1 - e) * -0.7;
  const introScale = 0.94 + 0.06 * e;

  cardGroup.rotation.x = current.x;
  cardGroup.rotation.y = current.y + introSpin;
  cardGroup.rotation.z = 0.02 + Math.sin(t * 0.38) * 0.006;
  cardGroup.position.y = BASE_Y + introDrop + Math.sin(t * 0.5) * 0.018;
  cardGroup.scale.setScalar(introScale);

  const lift = cardGroup.position.y - BASE_Y;
  shadow.material.opacity = (0.7 - lift * 1.6) * e;
  shadow.scale.setScalar(1 + lift * 0.35);

  // window rig follows the hand — an area light you can steer
  const cx = -3.0 + pointer.x * 2.2 + Math.sin(t * 0.13) * 0.5;
  const cy = 3.4 - pointer.y * 1.6 + Math.cos(t * 0.11) * 0.3;
  for (const { light, u, v } of windowRig) {
    light.position.set(
      cx + RIG_U.x * u + RIG_V.x * v,
      cy + RIG_U.y * u + RIG_V.y * v,
      3.0 + RIG_U.z * u + RIG_V.z * v
    );
  }

  // sweep grazes the edge from the side
  sweep.position.x = 4.2 + Math.sin(t * 0.2) * 0.4;
  sweep.position.y = 1.2 + pointer.y * -0.8;

  camera.position.x = Math.sin(t * 0.14) * 0.06 + pointer.x * 0.05;
  camera.position.y = Math.cos(t * 0.11) * 0.04 - pointer.y * 0.04;
  camera.position.z += (camZ - camera.position.z) * 0.07;
  camera.lookAt(0, 0.05, 0);

  holoMat.uniforms.uTime.value = t;
  finalMat.uniforms.uTime.value = t;

  renderer.setRenderTarget(rtScene);
  renderer.render(scene, camera);
  renderer.setRenderTarget(rtBloom);
  renderer.render(bloomScene, postCam);
  renderer.setRenderTarget(null);
  renderer.render(finalScene, postCam);
}

animate();

if (opts.initialSide === "back") setSide("back", true);

function dispose() {
  if (disposed) return;
  disposed = true;
  cancelAnimationFrame(raf);
  resizeObserver.disconnect();
  visibilityObserver.disconnect();
  cleanups.forEach(fn => fn());

  const disposeMaterial = (m) => {
    for (const v of Object.values(m)) if (v && v.isTexture) v.dispose();
    m.dispose();
  };
  for (const root of [scene, bloomScene, finalScene]) {
    root.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(disposeMaterial);
      }
    });
  }
  if (scene.environment) scene.environment.dispose();
  rtScene.dispose();
  rtBloom.dispose();
  renderer.dispose();
  renderer.forceContextLoss();
  canvas.remove();
}

return { setFace, setSide: (side) => setSide(side), dispose };
}
