# Deploy e infraestrutura

## Visão geral

| Item | Valor |
|---|---|
| Plataforma | Dokploy, projeto `assina_vip` |
| Domínio | `https://assinavip.battomic.com` (Traefik + Let's Encrypt) |
| Origem do build | Repositório no GitHub, branch `main` |
| App | `docker-compose.yml`: Next.js standalone na porta 3000 |
| Banco | `docker-compose.db.yml`: PostgreSQL 16, deploy separado |

A branch `main` é a que o Dokploy builda. Confira `npm run build` localmente antes de subir para ela.

## Imagem do app (`Dockerfile`)

Build em três estágios sobre `node:22-alpine`:

1. **deps:** `npm ci`.
2. **builder:** `npm run build`, que gera `.next/standalone` graças ao `output: "standalone"` do `next.config.ts`.
3. **runner:** copia só `public/`, `.next/standalone` e `.next/static`, e roda `node server.js` como o usuário `nextjs` (uid 1001).

Variáveis fixas na imagem: `NODE_ENV=production`, `PORT=3000`, `HOSTNAME=0.0.0.0`, `TZ=America/Sao_Paulo`, telemetria do Next desligada.

O `.dockerignore` deixa fora da imagem `docs/`, `rascunhos_anotacoes/`, arquivos `.env*` (exceto `.env.example`), os compose e a própria configuração Docker.

## Variáveis de ambiente

Configuradas na aba **Environment** do Dokploy. O Dokploy grava essa aba num `.env` ao lado do compose, e o compose do app carrega esse arquivo com `env_file`.

| Variável | Onde | Observação |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | App (build arg) | Variáveis `NEXT_PUBLIC_*` são embutidas no bundle **na hora do build**. Mudar o valor exige rebuild, não só restart |
| `PG_SUPER_USER` | Banco | Superusuário do Postgres |
| `PG_SUPER_PASSWORD` | Banco | |
| `PG_APP_USER` | Banco | Usuário que o app vai usar |
| `PG_APP_PASSWORD` | Banco | |

Os compose usam a sintaxe `${VAR:?mensagem}`. Se a variável faltar, o deploy **aborta** em vez de subir com string vazia.

Hoje o código não lê nenhuma variável de ambiente. Quando o app passar a falar com o banco, a conexão será com host `assina-postgres`, porta `5432`, database `assina_vip` e o usuário `PG_APP_USER`.

## Banco (`docker-compose.db.yml`)

- Imagem `postgres:16-alpine`, volume `vol-assina-postgres`.
- **Sem porta exposta e sem saída para a internet.** Ele só existe na rede `net-assina-data`.
- Healthcheck com `pg_isready`.
- `init/postgres-init.sh` roda **só no primeiro boot**, com o volume vazio. Ele cria o usuário do app como **dono** do database `assina_vip`. Assim o app pode rodar migrations (DDL) sem ser superusuário.

> **Armadilha:** se uma variável `PG_*` faltar no primeiro boot, o volume é inicializado sem o usuário do app e o script de init **nunca mais roda**. Para corrigir, crie o usuário manualmente via `psql` ou apague o volume (perdendo os dados).

O `.gitattributes` força final de linha LF em `*.sh`. Com CRLF, o bash do container quebra ao rodar o init.

## Redes

| Rede | Tipo | Quem usa |
|---|---|---|
| `net-assina-data` | Overlay `--internal`, sem egress | App e banco |
| `dokploy-network` | Rede do Dokploy | App (para o Traefik alcançá-lo) |

A `net-assina-data` é externa e precisa ser criada **uma vez** no servidor, via SSH:

```bash
docker network create --driver overlay --attachable --internal net-assina-data
```

## Testar o build standalone localmente

O `next start` não é o caminho certo para testar `output: "standalone"`. Rode o servidor gerado, como a imagem faz:

```bash
npm run build
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
PORT=3000 node .next/standalone/server.js
```

Se a porta continuar ocupada depois de parar o servidor, procure processos `node` órfãos antes de subir de novo.
