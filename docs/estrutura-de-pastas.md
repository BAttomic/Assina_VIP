# Estrutura de pastas

```text
Assina_VIP/
├── src/
│   ├── app/                         # Só rotas (App Router). Nada de componente reutilizável aqui
│   │   ├── layout.tsx               # Layout raiz: <html>, metadata, importa o CSS global
│   │   ├── favicon.ico
│   │   └── (loja)/                  # Route group da loja: não aparece na URL
│   │       ├── layout.tsx           # Casca da loja: Header + página + Footer
│   │       ├── page.tsx             # /
│   │       ├── produto/[slug]/page.tsx   # /produto/:slug
│   │       ├── carrinho/page.tsx    # /carrinho
│   │       └── checkout/page.tsx    # /checkout
│   ├── components/                  # Componentes agrupados por área
│   │   ├── layout/                  # Header, Footer
│   │   ├── home/                    # Hero, CategorySection, ProductSection, PromoBanner
│   │   ├── product/                 # ProductCard (usado na Home e na página de produto)
│   │   └── checkout/                # CreditCard3D, creditCardScene, PaymentSummary,
│   │                                # AlternativePayment, cardFormat
│   ├── data/
│   │   └── products.ts              # Tipos de produto + dados MOCK do catálogo
│   ├── lib/
│   │   └── format.ts                # Utilitários puros usados por várias áreas (preço)
│   └── styles/                      # Todo o CSS (ver estilos-css.md)
│       ├── globals.css              # Entrada única, só @imports em ordem
│       └── tokens.css, base.css, layout.css, product-card.css,
│           home.css, product-page.css, cart.css, checkout.css
├── public/
│   └── assets/                      # Imagens servidas em /assets/*
├── docs/                            # Esta documentação
├── init/
│   └── postgres-init.sh             # Roda só no 1º boot do Postgres (ver deploy-e-infra.md)
├── rascunhos_anotacoes/             # Material de referência (PDF de arquitetura). Fora da imagem Docker
├── Dockerfile                       # Build standalone para o Dokploy
├── docker-compose.yml               # App (Traefik, domínio)
├── docker-compose.db.yml            # PostgreSQL, deploy separado
├── next.config.ts                   # output: "standalone"
├── eslint.config.mjs
├── tsconfig.json                    # Alias @/* -> src/*
├── AGENTS.md                        # Gerado pelo `next dev`. Não editar à mão
└── CLAUDE.md                        # Instruções para agentes de IA
```

## Onde colocar código novo

| Vou criar… | Vai em… |
|---|---|
| Uma página da loja | `src/app/(loja)/<rota-em-pt-br>/page.tsx`. Ela ganha Header e Footer automaticamente e renderiza só o próprio `<main>` |
| Uma página **sem** Header/Footer da loja (ex.: painel administrativo) | Um novo route group, ex.: `src/app/(admin)/…`, com o próprio `layout.tsx` |
| Um componente usado por uma área só | `src/components/<área>/NomeDoComponente.tsx` |
| Um componente usado por várias áreas | Na pasta do domínio a que ele pertence (ex.: `ProductCard` em `product/`). Peças genéricas de interface sem domínio (botão, input, modal) vão para `src/components/ui/`, criada quando surgir a primeira |
| Uma função pura usada só por uma área | Ao lado dos componentes dela (ex.: `components/checkout/cardFormat.ts`) |
| Uma função pura usada por várias áreas | `src/lib/` |
| Tipos e dados de catálogo | `src/data/`. Enquanto não houver API, são mocks |
| Estilo de uma área nova | `src/styles/<área>.css` + `@import` em `globals.css` (ver [estilos-css.md](estilos-css.md)) |
| Imagem estática | `public/assets/` com nome em kebab-case descritivo (`netflix-banner.jpg`, não `img-002.jpg`) |
| Documentação | `docs/`, e um link no índice [README.md](README.md) |

## Regras

- `src/app/` contém só arquivos de convenção do Next (`page`, `layout`, `loading`, `error`, `route`…). Componentes de página vivem em `src/components/`.
- Um componente por arquivo. O nome do arquivo é o nome do componente.
- Rotas em português (`/carrinho`, `/produto`), porque aparecem para o cliente na URL.
- Quando o back-end entrar, os módulos de domínio de [arquitetura.md](arquitetura.md) (Catálogo, Estoque, Carrinho, Pedido, Pagamento, Assinatura, Cupom, Cliente) ganham fronteiras próprias. Um módulo não importa a camada de dados de outro.
