# Pendências

Levantadas na integração do front-end em 16/out/2026. Remova o item quando resolver.

## 🔴 Antes de ir para produção

| Item | Onde | Detalhe |
|---|---|---|
| Marca de terceiros no cartão 3D | `components/checkout/creditCardScene.ts` (`BRAND`, `LOGO_PATH`) | O cartão mostra "Jeezus BLACK", "JeezusDesign.", "jeezus.ai/black" e o símbolo da Claude, da Anthropic. Herança do demo original. Trocar pela identidade da AssinaVip |
| Footer de template | `components/layout/Footer.tsx` | Marca "cyber", texto sobre escritório de design de interiores em Portland, links em inglês com `href="#"`. Substituir pelo conteúdo real (institucional, atendimento, redes sociais) |
| Formato e moeda de preço | `lib/format.ts` e usos | Dois formatos convivem: "$25,35" nos cards e "$1399" (sem vírgula) no carrinho e no produto. Os dois usam "$" numa loja brasileira. Decidir o formato (provavelmente "R$ 13,99") e unificar no `format.ts` |
| Preço divergente do Netflix | `data/products.ts` | O mesmo produto aparece por 25.35 na vitrine e por 13.99 na página de produto e no carrinho |
| Página de termos | Link no checkout | `/termos` não existe e dá 404. O aceite dos termos é condição para pagar |
| Favicon | `src/app/favicon.ico` | Ainda é o ícone padrão do Next.js |

## 🟡 Conteúdo provisório

- Textos em inglês na interface: "Search" (busca), "Discounts up to -50%" (vitrine), "Shop Now" e texto lorem ipsum (banner promocional), "Code" (placeholder do cupom).
- Âncora `#avaliacoes` no menu não corresponde a nenhuma seção.
- Imagens de produtos físicos (iPhone, Galaxy, iPad, AirPods, Apple Watch) e o banner da Intel vieram do Figma de referência. Confirmar se a AssinaVip vai vender esses itens.
- O Galaxy Z Fold5 está na categoria "Jogos" no mock.
- Metadata mínima: só título e descrição. Faltam Open Graph e ícones.

## 🟡 Funcionalidade (tudo é mock hoje)

- **Back-end inexistente.** Stack a definir (ver [arquitetura.md](arquitetura.md)). O PostgreSQL está provisionado e sem uso.
- **Página de produto ignora o slug** e sempre mostra o Netflix. Só o Netflix tem `slug` no mock.
- **Carrinho sem estado real:** item fixo, "Remover" sem ação, cupom não aplicado, nada persiste entre páginas.
- **Checkout sem pagamento:** resumo fixo, contato sem validação, Pix sem QR code, Cripto sem integração, Pagar sem ação.
- Botões sem ação: busca, conta, setas e dots do Hero, cards e setas de categoria, abas da vitrine, favoritar, "Comprar Agora" dos cards, "Ver Mais", "Shop Now".

## 🔵 Técnico

- **Botão dentro de link.** No card com `slug`, o botão "Comprar Agora" fica dentro de um `<a>`. Elemento interativo dentro de outro é HTML inválido e confunde leitores de tela. Resolver quando o botão ganhar ação própria.
- **Cores escritas literalmente no CSS.** Migrar a paleta para variáveis em `tokens.css` (ver [estilos-css.md](estilos-css.md)).
- **Sem testes automatizados.** Hoje a verificação é lint, typecheck e build.
- **Páginas client inteiras.** Carrinho e checkout são `"use client"` por completo. Ao ligar dados reais, voltar a página para server e descer o estado para componentes client menores.
- **Three.js travado no r128.** Funciona, mas é de 2021. Portar a cena só se houver motivo.
- **Versão do Node local.** Algumas dependências avisam incompatibilidade de engine no Node 23. Use Node 22 localmente, a mesma versão da imagem.
