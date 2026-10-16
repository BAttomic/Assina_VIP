# Checkout e cartão 3D

## Regras para dados de cartão

Estas regras valem para qualquer código que toque número, nome, validade ou CVV de cartão. Elas não são opcionais.

1. **Só em memória.** Os dados vivem em `useState` da página de checkout. Nunca vão para `localStorage`, `sessionStorage`, cookie, URL, query string, `console.log` ou ferramenta de analytics.
2. **Todo input sensível recebe `PRIVATE_FIELD`** (de `components/checkout/cardFormat.ts`). Esses atributos (`data-private`, `data-sentry-mask`, `data-hj-suppress`) impedem ferramentas de session replay de gravar o campo.
3. **O CVV nunca vai para o cartão 3D.** A cena recebe só número, nome e validade. Quando o CVV ganha foco, o cartão apenas vira para o verso.
4. **Número mascarado fora de foco.** Com 13 dígitos ou mais e o campo sem foco, o cartão 3D mostra só os 4 últimos (`•••• •••• •••• 4291`).
5. **Entrada sanitizada:** número só com dígitos (até 19), validade no formato MM/AA, CVV com até 4 dígitos, nome só com letras, espaço, apóstrofo, ponto e hífen (até 26 caracteres).
6. **Autocomplete do navegador** com `cc-name`, `cc-number`, `cc-exp` e `cc-csc`, e `inputMode="numeric"` nos campos numéricos.

### Quando o gateway entrar

Recomendação, alinhada com [arquitetura.md](arquitetura.md):

- Os dados do cartão devem ser **tokenizados no navegador** pelo SDK do gateway. O nosso back-end recebe só o token, nunca o número do cartão. Isso mantém o projeto fora do escopo mais pesado do PCI DSS.
- Toda cobrança leva uma **chave de idempotência**.
- O botão Pagar fica desabilitado enquanto a cobrança estiver em andamento, para evitar duplo clique.

## Arquivos do checkout

| Arquivo | Papel |
|---|---|
| `app/(loja)/checkout/page.tsx` | Página client. Guarda método de pagamento, aceite de termos, dados do cartão e campo em foco |
| `components/checkout/PaymentSummary.tsx` | Coluna esquerda: item, contato e total (valores fixos) |
| `components/checkout/AlternativePayment.tsx` | Painel de Pix ou Cripto |
| `components/checkout/cardFormat.ts` | Funções puras: máscaras, formatação de validade, número exibido no cartão e `PRIVATE_FIELD` |
| `components/checkout/CreditCard3D.tsx` | Componente React do cartão 3D |
| `components/checkout/creditCardScene.ts` | A cena Three.js em si |

## Cartão 3D

### Como funciona

`CreditCard3D` é um componente client que ocupa 100% do elemento pai. O pai precisa ter altura definida, e o `.card-stage-inner` já tem.

Ele carrega `creditCardScene.ts` por **import dinâmico dentro de um `useEffect`**. Assim o Three.js só é baixado na página de checkout e nada roda no servidor.

A cena expõe uma API pequena e tipada:

```ts
createCardScene(container, face, { initialSide, distance, enableZoom })
// retorna:
{ setFace(face), setSide("front" | "back"), dispose() }
```

O componente cria a cena uma vez e depois só repassa mudanças pelas funções `setFace` e `setSide`. Uma ref guarda os valores mais recentes, para que a cena não nasça com dados velhos se o usuário digitar enquanto o Three.js ainda está carregando.

### Props

| Prop | Tipo | Descrição |
|---|---|---|
| `number` | string | Texto do número, já formatado e mascarado pela página |
| `holder` | string | Nome exibido. A página manda "NOME DO TITULAR" quando vazio |
| `expiry` | string | Validade exibida. A página manda "MM/AA" quando vazio |
| `side` | `"front"` ou `"back"` | Lado visível. A página manda `"back"` quando o CVV está em foco |
| `distance` | number, opcional | Distância da câmera (padrão 2.55). Menor deixa o cartão maior. Só é lida na montagem |

### Comportamento

- Animação de entrada de 2,6 segundos.
- Arrastar com mouse ou dedo gira o cartão. Duplo clique ou duplo toque vira o cartão.
- O zoom pela roda do mouse vem desligado, para não brigar com a rolagem da página.
- O texto é repintado no máximo uma vez por quadro.
- A renderização **pausa quando o cartão sai da tela** (`IntersectionObserver`) e se ajusta ao tamanho do contêiner (`ResizeObserver`).
- `dispose()` remove listeners, libera texturas, geometrias e o contexto WebGL. O componente chama isso ao desmontar.
- **Sem WebGL**, o componente mostra um cartão 2D simples com os mesmos dados, e o checkout continua utilizável.

### Ajustes visuais

| Quero… | Mexa em… |
|---|---|
| Aproximar ou afastar o cartão sem tocar na cena | `--scene-zoom` em `.card-stage` (`styles/checkout.css`) |
| Mudar o enquadramento da câmera | Prop `distance` |
| Trocar textos fixos do cartão | Constante `BRAND` em `creditCardScene.ts` |
| Trocar o logotipo | Constante `LOGO_PATH` (path SVG em viewBox 16×16) em `creditCardScene.ts` |

### Cuidados

- **`three` está travado em `0.128.0` exato.** A cena usa APIs do r128 (`outputEncoding`, `sRGBEncoding`, `physicallyCorrectLights`) que foram removidas em versões novas. Atualizar o Three.js exige portar a cena.
- `creditCardScene.ts` tem `@ts-nocheck` e `eslint-disable` porque é um porte de um demo em JavaScript puro. Só a API pública é tipada. Se precisar mexer na cena, teste no navegador, porque nem o TypeScript nem o lint vão pegar erro ali.
- **A marca no cartão não é da AssinaVip.** `BRAND` diz "Jeezus", "BLACK", "JeezusDesign." e "jeezus.ai/black", e o `LOGO_PATH` é o símbolo da Claude, da Anthropic. Os dois vieram do demo original e precisam ser trocados pela identidade da AssinaVip antes de ir para produção (ver [pendencias.md](pendencias.md)).
