# Páginas e fluxos

Tudo abaixo é **front-end com dados mock**. Nenhuma página fala com back-end, e nenhum botão de compra conclui uma compra.

| Rota | Arquivo | Renderização | Estado |
|---|---|---|---|
| `/` | `src/app/(loja)/page.tsx` | Estática, server | Visual pronto, interações pendentes |
| `/produto/[slug]` | `src/app/(loja)/produto/[slug]/page.tsx` | Dinâmica, server | Sempre mostra o Netflix |
| `/carrinho` | `src/app/(loja)/carrinho/page.tsx` | Estática, client | Item fixo, quantidade funciona |
| `/checkout` | `src/app/(loja)/checkout/page.tsx` | Estática, client | Formulário e cartão 3D funcionam, pagamento não |
| `/avaliacoes` | `src/app/(loja)/avaliacoes/page.tsx` | Estática, server | Sempre no estado vazio: ainda não há fonte de avaliações |

Todas as rotas da loja compartilham Header e Footer pelo `src/app/(loja)/layout.tsx`.

## Fluxo de compra pretendido

Definido em [arquitetura.md](arquitetura.md):

1. O cliente navega na vitrine (Home) e abre um produto.
2. Adiciona ao carrinho ou clica em Comprar.
3. No checkout, informa só nome e e-mail. Não há conta obrigatória.
4. Paga com cartão, Pix ou, mais tarde, cripto, via gateway.
5. Recebe automaticamente as credenciais ou um código de resgate por e-mail ou WhatsApp.
6. Depois da compra, pode criar conta opcionalmente.

Hoje os passos 1 a 3 existem visualmente. Os passos 4 a 6 não existem.

## Header (todas as páginas)

| Elemento | Comportamento atual |
|---|---|
| Marca "AssinaVip" | Link para `/` |
| Busca | Campo sem ação, placeholder em inglês ("Search") |
| Navegação | Home (`/`), Avaliações (`/avaliacoes`), Categorias (`/#categorias`) e Produtos (`/#produtos`). O item da página atual fica marcado (`components/layout/MainNav.tsx`) |
| Carrinho | Link para `/carrinho` |
| Conta | Botão sem ação |

Abaixo de 900px a navegação some e fica só marca, busca e ações.

## Footer (todas as páginas)

Marca, frase sobre a loja e direitos reservados, mais três colunas: **Links rápidos** (Início, Produtos, Categorias, Avaliações, Carrinho), **Ajuda e políticas** e **Compra** (Pix, cartão, entrega automática, compra sem cadastro). Suporte, Termos de uso, Privacidade e Reembolso aparecem como "em breve", sem link, até existirem. O canal de suporte é a constante `SUPPORT_URL` em `components/layout/Footer.tsx` (hoje `null`). Sem redes sociais por enquanto.

## Home (`/`)

| Seção | Componente | Comportamento atual |
|---|---|---|
| Hero | `components/home/Hero.tsx` | Dois banners no topo (Spotify e Netflix) e um largo (Intel) com 10 dots. Setas e dots não fazem nada. Abaixo de 900px o banner lateral some |
| Categorias | `components/home/CategorySection.tsx` | 5 cards (Os Mais Desejados, Xbox e Microsoft Store, Twitch Drops, Assinaturas, Jogos). Cards e setas sem ação. No celular a lista rola na horizontal |
| Vitrine | `components/home/ProductSection.tsx` | Abas Assinaturas, Assinaturas Premium e Mais Vendidos, sem ação. Grade com os 8 produtos de `subscriptionProducts` e seção "Discounts up to -50%" com os 4 de `discountedProducts`, que têm botão de favoritar sem ação |
| Banner promocional | `components/home/PromoBanner.tsx` | Imagem de liquidação de verão, texto lorem ipsum e botão "Shop Now" sem ação |

O card de produto só vira link quando o produto tem `slug` em `src/data/products.ts`. Hoje apenas o Netflix tem, apontando para `/produto/netflix-premium`.

## Página de produto (`/produto/[slug]`)

- **Ignora o slug.** Qualquer `/produto/*` mostra o mock `productDetail` (Netflix Premium 4K, 30 dias).
- Breadcrumb, imagem, estoque ("8 unidades em estoque"), preço com preço antigo riscado e descrição.
- "Adicionar ao Carrinho" leva a `/carrinho`. "Comprar" leva a `/checkout`. Nenhum dos dois adiciona nada a carrinho algum.
- Detalhes (formato, entrega, acesso, garantia) e "Como funciona" em 3 passos vêm do mock.
- "Ver Mais" não faz nada.
- "Produtos Similares" mostra os 4 primeiros de `subscriptionProducts`.

## Carrinho (`/carrinho`)

- Um único item fixo: Netflix Premium 4K, 30 dias, com preço base 13.99 por unidade (exibido como "$1399").
- Os botões de mais e menos alteram a quantidade, com mínimo de 1. O total é preço vezes quantidade.
- O campo de código promocional guarda o texto e não aplica desconto. Cupom deve ser validado no back-end.
- "Remover" não faz nada.
- "Pagamento" leva a `/checkout`.
- Nada é persistido. Recarregar a página volta para quantidade 1.

## Avaliações (`/avaliacoes`)

- Avaliações sobre a loja e as compras (não por produto).
- **Sem dados.** A página declara `const reviews: Review[] = []` e mostra o estado vazio (`ReviewsEmpty`): título, explicação, botão "Ver produtos" e as garantias da compra. Não preencher com avaliações de exemplo.
- Quando houver API, buscar as avaliações no próprio `page.tsx` (Server Component) e passar para `ReviewsView`, que já tem: nota média, distribuição por estrelas (clicável, filtra a lista), filtro por nota, busca, ordenação (recentes, maior e menor nota) e "Mostrar mais" de 10 em 10.
- O formato esperado está em `components/reviews/types.ts` e é **provisório**: alinhar com o back-end.
- `loading.tsx` (esqueleto) e `error.tsx` (mensagem e "Tentar de novo", via `retry`) já existem para quando a busca for real.

## Checkout (`/checkout`)

- **Resumo (esquerda):** item e total fixos ("$1399"), campos de nome e e-mail sem validação.
- **Pagamento (direita):** abas Cartão de Crédito, Pix e Cripto.
  - **Cartão:** cartão 3D interativo que espelha o que é digitado e vira para o verso quando o CVV ganha foco. Detalhes em [checkout-e-cartao-3d.md](checkout-e-cartao-3d.md).
  - **Pix:** só um texto explicativo. Não gera QR code.
  - **Cripto:** texto "será disponibilizado na próxima etapa".
- O aceite de termos habilita o botão Pagar. O link "termos e condições" aponta para `/termos`, que **não existe** e dá 404.
- **Pagar não faz nada.** "Voltar" leva a `/carrinho`.
- Os dados digitados no cartão sobrevivem à troca entre as abas, porque o estado mora na página.
