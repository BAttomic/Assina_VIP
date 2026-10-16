# Arquitetura

Resumo das decisões do documento de arquitetura (`rascunhos_anotacoes/estrutura.pdf`, v2, revisado a partir do briefing real do cliente). Quando uma decisão mudar, atualize este arquivo.

## Premissa de escala

A primeira análise supunha "100.000+ vendas de altíssimo tráfego". O briefing real é **~100 pedidos/dia no lançamento e até 500/dia** no futuro.

500 pedidos/dia equivalem a cerca de 0,006 pedido por segundo. Mesmo com pico concentrado, são poucos pedidos por minuto. Um único banco relacional bem configurado resolve com folga.

**Consequência:** nada de microserviços, Kafka, sharding, múltiplos bancos ou Kubernetes multi-cluster neste estágio. Reavaliar só se o volume passar de forma consistente de milhares de pedidos/dia.

## Modelo: monólito modular

Um único deploy, com módulos internos separados por domínio. Cada módulo tem sua camada de dados lógica dentro do mesmo banco e **não acessa diretamente as tabelas de outro módulo**. Isso permite extrair um módulo como serviço no futuro, se o volume justificar.

| Módulo | Responsabilidade |
|---|---|
| Catálogo | Produtos, variações, categorias (catálogo longo) |
| Estoque | Quantidade disponível, reserva, esgotado |
| Carrinho | Itens, cupom aplicado, cálculo de total |
| Pedido | Checkout, status do pedido, código de resgate |
| Pagamento | Integração com o gateway (PSP), status de cobrança |
| Assinatura | Cobrança recorrente, ciclo de vida (ativa, pausada, cancelada) |
| Cupom/Promoção | Regras de desconto |
| Cliente | Opcional, conta criada depois da compra |

Motivos: custo de um serviço só, velocidade de entrega com equipe pequena, transações ACID do Postgres cobrindo reserva, pedido e pagamento sem saga distribuída, e caminho de evolução aberto.

## Stack

| Camada | Decisão |
|---|---|
| Front-end | Next.js (React). SSR/ISR disponível para SEO depois |
| Back-end | **A definir.** O documento recomenda Node.js (NestJS) ou Python (Django/FastAPI). A prioridade é velocidade de desenvolvimento |
| Banco | PostgreSQL único. Sem réplicas, sharding ou NoSQL neste estágio |
| Cache | Redis opcional, para sessão de carrinho de visitante e disponibilidade de produto |
| Infra | Um ambiente de container. Na prática, Dokploy (ver [deploy-e-infra.md](deploy-e-infra.md)) |
| Fila | Opcional e leve (ex.: SQS), só se e-mail e webhook precisarem ser desacoplados |

## Estoque e overselling

- **Optimistic locking** no Postgres (coluna `version` na tabela de estoque) basta para esse volume.
- Fluxo:
  1. O checkout tenta **reservar** a quantidade numa transação (`SELECT … FOR UPDATE` ou checagem otimista).
  2. Sem estoque suficiente, o produto vira **Esgotado** automaticamente (`sold_out = true` quando `quantidade <= 0`).
  3. A reserva **expira** em 15 a 30 minutos se o pagamento não for concluído.
- Um cron simples limpa reservas expiradas. Não precisa de mensageria.

## Pagamentos

Requisitos: cartão, Pix, parcelamento próprio, carteira digital e, possivelmente, cripto.

| Método | Decisão |
|---|---|
| Cartão, Pix e carteira | Um único gateway nacional (ex.: Pagar.me, Mercado Pago; Stripe se operar fora do Brasil) |
| Parcelamento próprio | Lógica interna: o pedido nasce com um plano de parcelas gerido pela plataforma |
| Cripto | Integração separada e opcional, fora do MVP (ex.: Coinbase Commerce, BitPay), sem custodiar ativos |

**Idempotência é obrigatória.** Toda chamada de cobrança usa uma chave de idempotência, para não cobrar duas vezes num reenvio.

## Assinatura e compra única no mesmo carrinho

- **Compra única:** pagamento único e geração de código de resgate.
- **Assinatura:** usar a **recorrência nativa do gateway** (cobrança por token de cartão) no MVP. Motor próprio só se as regras ficarem muito específicas.
- Modelagem sugerida: tabela `subscriptions` ligada ao cliente ou ao "pedido-mãe", com status `active`, `paused` ou `canceled` e a data da próxima cobrança.

## Checkout sem conta (guest checkout)

- O cliente compra informando só e-mail ou telefone, e endereço quando houver entrega física.
- O pedido gera um **código de resgate único** enviado por e-mail, WhatsApp ou SMS. Ele serve para consultar o pedido ou acessar a assinatura sem login.
- Depois da compra, oferecer criar conta e vincular os pedidos anteriores pelo e-mail.
- **Decisão em aberto com o cliente:** se o código de resgate pode pausar ou cancelar assinatura sem conta, ou se assinatura vai exigir conta.

## Cupons

Código, tipo (percentual ou valor fixo) e regras de validade (data, limite de usos, valor mínimo, produtos elegíveis). **Sempre validado e calculado no back-end.** O front nunca é fonte de verdade para desconto.

## Build vs. buy

Plataformas como VTEX ou commercetools ficam caras e superdimensionadas para 100 a 500 pedidos/dia. Elas também atendem mal o modelo híbrido de assinatura com compra única e o checkout sem conta. **Decisão: desenvolvimento próprio enxuto.**

## Quando revisar

| Gatilho | Ação |
|---|---|
| Catálogo passa de ~50.000 SKUs com busca lenta | Elasticsearch ou Algolia, só para busca |
| Mais de ~2.000 a 3.000 pedidos/dia sustentados | Avaliar extrair Pedido/Estoque como serviço |
| Picos causam lentidão perceptível | Redis para cache de catálogo e CDN para páginas estáticas |
| Volume de e-mails e webhooks cresce muito | Fila assíncrona leve |
| Reconciliação financeira complexa entre assinatura e compra única | Plataforma de billing dedicada (ex.: Stripe Billing) |

## Como o front atual se relaciona com os domínios

| Domínio | Onde aparece hoje | Fonte dos dados |
|---|---|---|
| Catálogo | Home (`/`) e página de produto (`/produto/[slug]`) | `src/data/products.ts` (mock) |
| Carrinho e Cupom | `/carrinho` | Estado local da página, item fixo |
| Pedido e Pagamento | `/checkout` | Estado local, resumo fixo, sem gateway |

Os tipos `Product` e `ProductDetail` em `src/data/products.ts` são o primeiro rascunho do contrato com a API. Quando o back-end existir, os arrays mock saem e os tipos passam a descrever a resposta da API.
