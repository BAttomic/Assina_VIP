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
| 5 | `home.css` | Hero, categorias, vitrine, banner promocional |
| 6 | `product-page.css` | `/produto/[slug]` |
| 7 | `cart.css` | `/carrinho` |
| 8 | `checkout.css` | `/checkout` |

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
- Sem `!important`. A única exceção herdada é `.how-title` na página de produto.
- Estilo inline (`style={{…}}`) só no fallback do cartão 3D sem WebGL.

## Tokens

Definidos em `tokens.css`:

| Variável | Valor | Uso |
|---|---|---|
| `--bg` | `#fff` | Fundo da página |
| `--text` | `#090909` | Cor de texto padrão |
| `--surface` | `#f5f5f5` | Superfícies cinza (item do resumo no checkout, ícone do Pix) |
| `--surface-2` | `#f1f1f1` | Reservado, ainda sem uso |
| `--muted` | `#7c7c7c` | Reservado, ainda sem uso |
| `--border` | `#e7e7e7` | Reservado, ainda sem uso |
| `--max` | `1110px`, ou `calc(100% - 32px)` abaixo de 900px | Largura máxima do conteúdo |

A maior parte das cores ainda está escrita literalmente nos arquivos, como veio do Figma. **Regra para código novo:** cor ou medida que se repete vira variável em `tokens.css` antes de ser usada.

## Paleta de fato

| Papel | Cores usadas |
|---|---|
| Preto de ação (botões, footer) | `#050505` |
| Texto forte | `#111`, `#0b0b0b`, `#090909` |
| Texto secundário | `#999`, `#888`, `#7c7c7c`, `#555` |
| Placeholder e texto apagado | `#a7a7a7`, `#a5a5a5`, `#9a9a9a`, `#929292` |
| Superfícies | `#f7f7f7`, `#f6f6f6`, `#f5f5f5`, `#f4f4f4`, `#f1f1f1`, `#f0f0f0` |
| Bordas | `#e5e5e5`, `#e4e4e4`, `#e2e2e2`, `#dcdcdc`, `#d9d9d9`, `#d3d3d3` |
| Acento (links, dot ativo, anel de foco) | `#5e65f5` |
| Sucesso (estoque) | `#14b866` |

A interface é **monocromática** (preto, branco e cinzas), com um único acento azul-violeta. Mantenha assim.

## Tipografia

- Fonte: `Arial, Helvetica, sans-serif`. Não há fonte web carregada.
- Corpo: 13px.
- Escala do Figma, pequena: 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20 e 21px. Títulos de página ficam entre 16 e 21px.
- Pesos: 400, 500 (títulos de seção), 600 e 700 (marca, título do produto).
- Títulos grandes usam `letter-spacing` levemente negativo (`-.01em` a `-.025em`).

## Layout e espaçamento

- Contêiner padrão: `width: min(calc(100% - 48px), var(--max)); margin: 0 auto;`
- No celular (até 560/600px), o contêiner vira `calc(100% - 24px)`.
- Hero e banner promocional vão até 1120px.
- Grades com `display: grid` e `minmax(0, 1fr)`. A vitrine tem 4 colunas, e 2 abaixo de 900px.

## Breakpoints

Desktop-first, sempre com `max-width`. As media queries ficam **no fim** do arquivo da área.

| Breakpoint | Onde |
|---|---|
| 900px | Header, Home, grade de produtos, checkout |
| 850px | Carrinho |
| 800px | Página de produto |
| 600px | Carrinho |
| 560px | Header, Home, Footer, página de produto, checkout |

Para área nova, use 900px e 560px.

## Forma e interação

- Raio: 4 a 5px em botões e inputs, 6 a 9px em cards, 10px no Hero e no palco do cartão, 50% em ícones redondos.
- Sombra quase não existe. A exceção são as setas do Hero (`0 1px 4px rgba(0,0,0,.12)`).
- Transição: `.2s ease`. O hover de botão escuro reduz a opacidade para `.86` ou `.88`. Cards sobem 1 a 2px (`translateY`).
- Botão desabilitado: `opacity: .35; cursor: not-allowed`.
- Foco:
  - Botões e links: `outline: 2px solid` em `#111` ou `#5e65f5`, com `outline-offset`.
  - Inputs: `border-color: #111` com `box-shadow: 0 0 0 3px rgba(0,0,0,.08)`.
  - Sempre via `:focus-visible`, nunca `:focus`.
- Toda animação contínua precisa de uma regra `@media (prefers-reduced-motion: reduce)` que a desligue.

## Caminho futuro

A documentação do Next recomenda CSS global só para estilos realmente globais e CSS Modules para o resto. Migrar para CSS Modules é uma opção quando o número de páginas crescer e o risco de colisão de classe aumentar. Até lá, o prefixo por bloco evita colisões.
