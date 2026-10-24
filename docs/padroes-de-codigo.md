# Padrões de código

## Antes de começar

- **Next.js 16.** Leia o guia em `node_modules/next/dist/docs/` antes de usar uma API do Next. Muita coisa mudou desde o Next 14/15.
- Rode antes de cada commit:

```bash
npm run lint
npm run typecheck
npm run build
```

O `build` é o mesmo que roda no Dokploy. Se ele falha local, o deploy falha.

## Idioma

| O quê | Idioma | Exemplo |
|---|---|---|
| Textos da interface | Português (pt-BR) | "Adicionar ao Carrinho" |
| Rotas (aparecem na URL) | Português | `/carrinho`, `/produto/[slug]` |
| Comentários e documentação | Português | `// Dados do cartão: ficam só em memória` |
| Nomes no código (componentes, variáveis, tipos, classes CSS) | Inglês | `ProductCard`, `cardNumber`, `.cart-item` |
| Mensagens de commit | Português, verbo no presente | "Adiciona página de termos" |

## TypeScript

- `strict: true`. Sem `any` explícito.
- `// @ts-nocheck` existe **só** em `components/checkout/creditCardScene.ts`, que é um porte de um demo em JavaScript puro. A API pública desse arquivo é tipada. Não use `@ts-nocheck` em código novo.
- Tipos de domínio ficam junto dos dados (`src/data/products.ts`). Props de componente ficam no próprio arquivo, num `type Props`.
- Use os helpers globais do Next para props de rota: `PageProps<"/rota">` e `LayoutProps<"/rota">`. Eles são gerados pelo `next typegen`, que o `npm run typecheck` já roda.
- No Next 16, `params` e `searchParams` são **Promise**: `const { slug } = await props.params`.

## Imports

- Use sempre o alias `@/` (aponta para `src/`): `import ProductCard from "@/components/product/ProductCard"`.
- Import relativo só entre arquivos irmãos da mesma pasta, como `CreditCard3D.tsx` importando `./creditCardScene`.
- Ordem: pacotes externos (`next/*`, `react`, `lucide-react`) primeiro, depois `@/…`.

## Componentes

- Um componente por arquivo, `export default function NomeDoComponente`, arquivo com o mesmo nome em PascalCase.
- Arquivos que não são componente (utilitários, cena 3D) usam camelCase: `cardFormat.ts`, `creditCardScene.ts`.
- **Server Component por padrão.** Coloque `"use client"` só onde há estado, efeito ou handler, e no menor componente possível.
  - Hoje `carrinho/page.tsx` e `checkout/page.tsx` são client inteiras porque guardam estado. Quando os dados virem da API, a página deve voltar a ser server e o estado deve descer para um componente client.
  - Header, Footer e toda a Home são server. A única peça client da casca é `ScrollReveal` (animação de entrada), que não renderiza nada.
- Páginas dentro de `(loja)` renderizam **só o próprio `<main>`**. Header e Footer vêm do `(loja)/layout.tsx`. Não importe Header/Footer numa página.
- Dados de produto não ficam escritos dentro de componentes. Eles vêm de `src/data/` (hoje mock, depois API).
- Listas renderizadas com `.map` usam `key` estável (id, label ou título), nunca o índice.

## Preços

Toda exibição de preço passa por `src/lib/format.ts`. Não formate preço inline com `toFixed` ou `toLocaleString`.

O formato é único, real brasileiro (`formatPrice(13.99)` resulta em "R$ 13,99"). Desconto percentual também sai de lá (`discountPercent`).

## Imagens

- Sempre `next/image`, nunca `<img>`.
- Padrão do projeto: `fill` + um contêiner com `position: relative` e tamanho definido no CSS + `sizes` coerente com o layout.
- `preload` só na imagem principal acima da dobra (o banner grande do Hero e a imagem principal da página de produto). No Next 16 a prop `priority` foi depreciada e substituída por `preload`.
- `alt` descritivo em português.
- Arquivos em `public/assets/`, nome kebab-case descritivo. O Next 16 exige configuração (`images.localPatterns`) para imagem local com query string, então evite `?v=1` em `src`.

## Ícones

- Biblioteca: `lucide-react`, travada em `^0.468.0`.
- Passe `size` e `strokeWidth` explícitos, seguindo o Figma. Os usos atuais ficam entre 11 e 26 de tamanho e 1.2 a 2 de traço.
- Ícone decorativo ao lado de texto não precisa de `aria-label`. Botão ou link **só com ícone** precisa (`aria-label="Carrinho"`).
- Antes de atualizar o `lucide-react`, confira se os ícones de marca usados (Twitter, Facebook, Instagram, Twitch) ainda existem na versão nova. O Lucide vem depreciando ícones de marca.

## Acessibilidade

- Inputs têm `<label>` ou `aria-label`. Grupos de inputs usam `role="group"` com `aria-labelledby`.
- Abas usam `role="tablist"`, `role="tab"` e `aria-selected` (ver métodos de pagamento no checkout).
- Foco visível com `:focus-visible` (ver [estilos-css.md](estilos-css.md)).
- Animação respeita `prefers-reduced-motion`.
- Elementos puramente visuais usam `aria-hidden="true"` (ex.: palco do cartão 3D, dots do Hero).

## Dados sensíveis

Dados de cartão têm regras próprias e inegociáveis. Leia [checkout-e-cartao-3d.md](checkout-e-cartao-3d.md) antes de mexer no checkout.

## Dependências

| Pacote | Versão | Observação |
|---|---|---|
| `next` | 16.3.5 (exata) | Atualizar junto com `eslint-config-next` |
| `react`, `react-dom` | 19.2.8 (exata) | |
| `three` | **0.128.0 (exata)** | A cena do cartão usa APIs do r128 que não existem em versões novas. Não atualize sem portar a cena |
| `@types/three` | 0.128.0 (exata) | Acompanha o `three` |
| `lucide-react` | ^0.468.0 | Ver ícones de marca acima |

Não há Tailwind, CSS-in-JS nem biblioteca de componentes. Adicionar qualquer um deles é uma decisão de projeto, não de tarefa.
