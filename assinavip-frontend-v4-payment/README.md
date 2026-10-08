# AssinaVip — Frontend

Primeira implementação da Home baseada no PDF exportado do Figma enviado na conversa.

## Stack
- Next.js + React + TypeScript
- CSS puro para manter o controle visual e reduzir dependências
- Lucide React para ícones
- Dados mockados em `src/data/products.ts`

## Rodar

```bash
npm install
npm run dev
```

Depois abra `http://localhost:3000`.

## Próximos passos
1. Ajustar a Home comparando lado a lado com o Figma.
2. Criar catálogo e página de produto.
3. Criar carrinho e checkout apenas no frontend.
4. Integrar o Spline no método de pagamento por cartão.
5. Preparar interfaces/types para a API do backend.


### Added in v3
- Shopping cart page at `/carrinho`, based on the supplied Shopping Cart design.
- Frontend-only quantity control and promo-code field.
- Checkout placeholder at `/checkout` for the next frontend stage.
