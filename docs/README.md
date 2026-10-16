# Assina_VIP — documentação

AssinaVip é uma loja online de **assinaturas digitais** (Netflix, Spotify, Discord Nitro, Canva, CapCut…), **jogos** e **produtos**. O cliente compra sem precisar criar conta e recebe o acesso automaticamente (credenciais ou código de resgate).

| | |
|---|---|
| Domínio | `assinavip.battomic.com` |
| Volume esperado | ~100 pedidos/dia no lançamento, até ~500/dia |
| Stack atual | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · CSS puro · Three.js r128 |
| Banco | PostgreSQL 16 provisionado no Dokploy, **ainda não usado pelo código** |
| Estado | Só front-end, com dados mock. Sem back-end, sem pagamento real |

## Rodar localmente

```bash
npm ci
npm run dev        # http://localhost:3000
```

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Turbopack) |
| `npm run build` | Build de produção (`output: "standalone"`), o mesmo que o Dockerfile roda |
| `npm run start` | Sobe o build (para testar o standalone, veja [deploy-e-infra.md](deploy-e-infra.md)) |
| `npm run lint` | ESLint (o `next lint` não existe mais no Next 16) |
| `npm run typecheck` | Gera os tipos de rota (`next typegen`) e roda `tsc --noEmit` |

Use Node 22 localmente, a mesma versão da imagem Docker.

> **Next.js 16 não é o Next que você conhece.** APIs e convenções mudaram. Antes de escrever código, leia o guia correspondente em `node_modules/next/dist/docs/` (regra do [AGENTS.md](../AGENTS.md)).

## Índice

| Documento | Conteúdo |
|---|---|
| [arquitetura.md](arquitetura.md) | Decisões de arquitetura do produto: monólito modular, domínios, estoque, pagamentos, assinaturas, checkout sem conta |
| [estrutura-de-pastas.md](estrutura-de-pastas.md) | Onde fica cada coisa e onde colocar código novo |
| [padroes-de-codigo.md](padroes-de-codigo.md) | Convenções de TypeScript/React: componentes, imports, server vs client, imagens, ícones, idioma |
| [estilos-css.md](estilos-css.md) | Como o CSS está organizado, tokens, paleta, tipografia, breakpoints, convenção de classes |
| [paginas-e-fluxos.md](paginas-e-fluxos.md) | Cada rota, o que funciona e o que ainda é mock |
| [checkout-e-cartao-3d.md](checkout-e-cartao-3d.md) | Regras para dados de cartão e funcionamento do cartão 3D |
| [deploy-e-infra.md](deploy-e-infra.md) | Dokploy, Docker, PostgreSQL, variáveis de ambiente, redes |
| [pendencias.md](pendencias.md) | O que falta ou está provisório, com prioridade |

## Histórico

- **Set/2026:** base Next.js e infraestrutura de deploy (Dockerfile, compose do app e do Postgres).
- **Out/2026:** o front-end foi construído externamente (versões v1 a v4) a partir de um PDF exportado do Figma. Ele chegou na pasta `assinavip-frontend-v4-payment/`, com `package.json` próprio em Next 15.
- **16/out/2026:** o front-end foi integrado à raiz do projeto. Passou para Next 16, rotas no route group `(loja)`, componentes por área e CSS fatiado por área. Imagens duplicadas, código morto e o Tailwind foram removidos. O HTML renderizado das 4 rotas foi comparado com o original e ficou idêntico.
- O documento de arquitetura original está em `rascunhos_anotacoes/estrutura.pdf`.
