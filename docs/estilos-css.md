# Estilos (CSS)

O projeto usa **CSS puro global**, sem Tailwind, CSS-in-JS ou biblioteca de componentes. O front-end foi construído assim para reproduzir o Figma com controle total. O Tailwind que vinha no projeto base foi retirado na integração porque ninguém o usava e o reset dele (preflight) alteraria margens e pesos de título do layout.

## Organização

Todo o CSS fica em `src/styles/`. O layout raiz importa **um único arquivo**, `globals.css`, que só contém `@import` em ordem fixa:

| Ordem | Arquivo | Conteúdo |
|---|---|---|
| 1 | `tokens.css` | Variáveis CSS (`:root`) |
| 2 | `base.css` | Reset mínimo e estilos de elemento (`body`, `button`, `a`). Nenhuma classe |
| 3 | `layout.css` | Header e Footer |
| 4 | `product-card.css` | Grade e card de produto, compartilhados entre Home e página de produto |
| 4b | `purchase.css` | Vantagens da compra e perguntas frequentes (Home, produto, checkout) |
| 5 | `home.css` | Hero, categorias, vitrine, banner promocional |
| 6 | `product-page.css` | `/produto/[slug]` |
| 7 | `cart.css` | `/carrinho` |
| 8 | `checkout.css` | `/checkout` |
| 9 | `reviews.css` | `/avaliacoes` |
| 10 | `categories.css` | `/categorias` e `/categorias/[slug]` |
| 11 | `catalog.css` | `/produtos` |

**A ordem importa.** Peças compartilhadas vêm antes das páginas, porque as páginas às vezes as especializam (ex.: `.similar-grid .product-card`).

### Para adicionar estilo de uma área nova

1. Crie `src/styles/<área>.css` começando com um comentário que diga a que rota ou componente ele pertence.
2. Adicione o `@import` em `globals.css`, depois das peças compartilhadas.
3. Não importe CSS direto de um componente. O Next não remove folhas globais ao navegar, e a ordem final fica imprevisível.

## Convenção de classes

- **kebab-case com prefixo do bloco:** `cart-item`, `cart-product-image`, `payment-methods`, `hero-arrow`.
- **Estado** com classe modificadora curta aplicada junto: `.active` (aba selecionada, link de navegação atual, dot do Hero), `.left` e `.right` (setas).
- Utilitário só quando muito pontual: `.span-2` no grid de campos do cartão.
- Seletor de elemento só **dentro** de um bloco (`.order-summary input`). Seletor de elemento solto fica só em `base.css`.
- Sem `!important`.
- Estilo inline (`style={{…}}`) só no fallback do cartão 3D sem WebGL e em medidas que vêm dos dados (largura das barras de distribuição em `ReviewsSummary`).

## Tokens

Definidos em `tokens.css`, com os valores do Figma. Use a variável, não a cor literal.

| Variável | Valor | Uso |
|---|---|---|
| `--bg` / `--text` | `#fff` / `#000` | Fundo e texto padrão |
| `--ink` | `#000` | Botões escuros e footer |
| `--section` | `#fafafa` | Fundo de seções (categorias, detalhes do produto) |
| `--surface` | `#f6f6f6` | Card de produto, item do resumo, ícone de entrega |
| `--surface-2` / `--surface-3` | `#f5f5f5` / `#ededed` | Campo de busca / card de categoria |
| `--muted` / `--muted-2` | `#6f6f6f` / `#717171` | Abas e navegação inativas, preço riscado / texto secundário (descrições, breadcrumb). Os cinzas do Figma (`#8b8b8b`, `#9f9f9f`, `#a4a4a4`) ficavam abaixo de 4,5:1 e foram escurecidos |
| `--subtle` / `--placeholder` | `#9f9f9f` / `#979797` | Descrições / placeholder |
| `--border` / `--border-field` / `--divider` | `#ebebeb` / `#cecece` / `#cdcdcd` | Contorno de cartões / de campos / linhas de lista |
| `--accent` | `#645cfa` | Links e anel de foco |
| `--success` | `#15803d` | Estoque. O verde do Figma (`#22c55e`) tinha 2,3:1 de contraste |
| `--radius-sm` / `--radius-md` / `--radius-field` / `--radius-card` | 6 / 8 / 7 / 10px | Botões grandes / botões de card e imagens / campos / cartões |
| `--max` | `1120px` | Largura máxima do conteúdo |
| `--gutter` | `48px`, `32px` abaixo de 900px | Soma das margens laterais do contêiner |
| `--section-y` | `80px`, `56px` (≤900px), `40px` (≤560px) | Respiro vertical das seções |
| `--ease` | `.2s ease` | Transições |

**Regra para código novo:** cor ou medida que se repete vira variável em `tokens.css` antes de ser usada.

A interface é **monocromática** (preto, branco e cinzas), com um único acento azul-violeta. Mantenha assim.

## Tipografia

- Fonte: **Inter**, carregada com `next/font/google` em `src/app/layout.tsx` e exposta como `--font-inter`. `Arial` fica só como fallback.
- Corpo: 14px, `line-height` 1.5.
- Escala do Figma: 14 (texto, botões de card), 16 (nomes de produto, navegação, botões grandes), 18 (abas da vitrine, marca), 20 (subtítulos), 24 (títulos de seção e preço do card), 32 (preço do produto) e 72px (banner promocional).
- Pesos: 400, 500 (padrão para títulos, navegação e botões), 600 (preço do card, footer) e 700 (título do produto, resumos).

## Layout e espaçamento

- Contêiner padrão: `width: min(calc(100% - var(--gutter)), var(--max)); margin: 0 auto;`
- Os banners do Hero respeitam o contêiner padrão (`--max`), alinhados com as demais seções: dois lado a lado no desktop, um só abaixo de 900px. Só o banner promocional ocupa a largura toda da tela.
- Nada pode ficar cortado na borda da tela no celular: listas que não cabem quebram em grade ou em várias linhas (categorias da Home em 3 colunas, abas da vitrine com quebra de linha), em vez de rolar para o lado.
- Grades com `display: grid` e `minmax(0, 1fr)`. A vitrine tem 4 colunas, 3 abaixo de 1100px e 2 abaixo de 900px. Espaço entre cards: 16px.
- Card de produto: imagem de 160px, nome 16px, preço 24px semibold, botão de largura total com 48px de altura.

## Breakpoints

Desktop-first, sempre com `max-width`. As media queries ficam **no fim** do arquivo da área.

| Breakpoint | Onde |
|---|---|
| 1200px | Header (navegação mais compacta) |
| 1180px | Home: grade de categorias com vãos menores |
| 1100px | Grade de produtos (3 colunas); em `/produtos`, 2 colunas ao lado dos filtros |
| 1000px | Checkout, grade de `/categorias` (2 colunas) |
| 900px | Header, Footer, Home, grade de produtos, página de produto, carrinho, checkout |
| 600px | Carrinho |
| 560px | Header, Footer, Home, grade de produtos, página de produto, checkout |

Para área nova, use 900px e 560px.

## Forma e interação

- Raio: 6px em botões grandes, 7px em campos, 8px em botões de card e imagens, 9px no card de produto, 10px em cartões de resumo, 15px no card de categoria, 24px nos banners do Hero, 50% em ícones redondos.
- Sombra quase não existe: setas do Hero e o hover do card de produto (`0 6px 20px rgba(0,0,0,.06)`).
- Transição: `var(--ease)`. Botão escuro no hover reduz a opacidade para `.86`. Botão claro ganha fundo `--surface`. Cards sobem 2px (`translateY`).
- Botão só com ícone tem área de toque de 32px no desktop e 40px no celular.
- Botão desabilitado: `opacity: .35; cursor: not-allowed`.
- Foco:
  - Botões e links: `outline: 2px solid var(--accent)` com `outline-offset: 2px`, definido em `base.css`.
  - Inputs: `border-color: var(--text)` com `box-shadow: 0 0 0 3px rgba(0,0,0,.08)`.
  - Sempre via `:focus-visible`, nunca `:focus`.
- Toda animação contínua precisa de uma regra `@media (prefers-reduced-motion: reduce)` que a desligue.
- Contraste mínimo: 4,5:1 para texto comum e 3:1 para texto grande. Placeholder também conta.

## Animação de entrada

`components/layout/ScrollReveal.tsx`, montado em `(loja)/layout.tsx`, anima a entrada dos blocos ao rolar (sobe 24px e aparece, em 0,6s, escalonado em 70ms). A lista de seletores fica no próprio componente; para animar um bloco novo, acrescente o seletor lá. Regras:

- Só `transform` e `opacity`. O CSS (`.reveal`, `.is-visible`) fica em `layout.css`.
- O conteúdo só é ocultado depois que o script roda: sem JavaScript, tudo aparece.
- O que já está na primeira tela não é animado.
- Com `prefers-reduced-motion: reduce`, nada é animado. Atenção ao testar: se o Windows estiver com "efeitos de animação" desligados, o navegador reporta essa preferência e a animação não aparece.
- Botões principais e cards "afundam" levemente ao serem pressionados (`transform: scale(.97)` em `:active`).

## Caminho futuro

A documentação do Next recomenda CSS global só para estilos realmente globais e CSS Modules para o resto. Migrar para CSS Modules é uma opção quando o número de páginas crescer e o risco de colisão de classe aumentar. Até lá, o prefixo por bloco evita colisões.
