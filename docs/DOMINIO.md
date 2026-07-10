# Domínio personalizado

> **English summary**: this is the runbook for pointing a custom domain at this GitHub
> Pages site later. Activation is a one-line `CNAME` file commit; DNS records and the
> HTTPS/verification steps are documented below in Portuguese. The app code needs
> **zero changes** — every internal path is already relative and hash-routed.

Este guia é executado **quando** houver um domínio escolhido. Até lá, o site vive em
`https://pgillets.github.io/simple_single_page_app/` e nada aqui precisa ser feito.

## 1. Visão geral

O que muda: a URL do site. O que **não** muda: o fluxo de deploy (`git push` →
publicado), o código da aplicação (todos os caminhos internos são relativos) e o
processo de build (continua não existindo nenhum).

## 2. Pré-requisitos

- Ter o domínio registrado e acesso ao painel de DNS dele.
- Decidir a forma canônica: domínio apex (`exemplo.com.br`), `www` (`www.exemplo.com.br`)
  ou um subdomínio (`app.exemplo.com.br`). A recomendação é configurar **apex + www**
  juntos (o GitHub redireciona um para o outro automaticamente), com o `CNAME` do
  repositório apontando para a forma escolhida como canônica.

## 3. Verificar o domínio no GitHub (antes de tudo)

Isso evita que alguém tome posse do domínio via Pages caso o site seja desativado no
futuro enquanto o DNS ainda aponta para o GitHub.

1. **Settings da conta** (não do repositório) → **Pages** → **Add a domain**.
2. Informe o domínio apex e crie o registro **TXT** indicado, algo como:
   `_github-pages-challenge-pgillets.exemplo.com.br` → token fornecido pelo GitHub.
3. Clique em **Verify**. Verificar o apex cobre todos os subdomínios dele.

## 4. Registros de DNS

**Domínio apex** (`exemplo.com.br`):

| Tipo | Nome | Valor |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

**`www` ou subdomínio** (`www.exemplo.com.br` ou `app.exemplo.com.br`):

| Tipo | Nome | Valor |
|---|---|---|
| CNAME | `www` (ou o subdomínio) | `pgillets.github.io.` |

Atenção: o CNAME aponta para `pgillets.github.io`, **nunca** para
`pgillets.github.io/simple_single_page_app`.

Outros cuidados:
- Se a zona tiver um registro **CAA**, ele precisa permitir `letsencrypt.org`, ou a
  emissão do certificado HTTPS falha silenciosamente.
- Reduza o **TTL** dos registros antigos para algo baixo (ex.: 300s) um pouco antes da
  troca, para acelerar a propagação.
- Remova registros conflitantes (A/AAAA/ALIAS antigos, CNAMEs de parking).

## 5. O commit de uma linha

Crie o arquivo `CNAME` na raiz do repositório, na branch `main`, contendo **só** o
domínio escolhido (sem `http://`, sem barra final):

```
exemplo.com.br
```

Esse commit é suficiente: o próximo deploy do Pages lê o arquivo e preenche sozinho o
campo "Custom domain" em Settings → Pages. (O caminho inverso também funciona — digitar
o domínio direto em Settings → Pages cria esse mesmo commit automaticamente — mas dê
preferência ao commit direto, que é rastreável no histórico do repositório.)

## 6. HTTPS

1. Aguarde o indicador de DNS em Settings → Pages ficar verde.
2. O GitHub emite um certificado Let's Encrypt automaticamente — normalmente em
   minutos, mas pode levar até ~24h se a propagação de DNS for lenta.
3. Assim que o certificado existir, marque **"Enforce HTTPS"**. Antes disso a opção
   fica desabilitada — não esqueça de voltar e marcá-la.

## 7. Checklist pós-migração (só código, sem risco)

O código da aplicação não precisa de nenhuma mudança — roteamento por hash e caminhos
relativos já funcionam em qualquer base. O que **vale a pena** atualizar, por serem as
únicas URLs absolutas do projeto:

- [ ] `index.html`: `<link rel="canonical">`, `og:url`, `og:image` e as URLs dentro do
      bloco `<script type="application/ld+json">` → novo domínio.
- [ ] `tecnologia.html`: `<link rel="canonical">`, `og:url`, `og:image` → novo domínio.
- [ ] `robots.txt`: a linha `Sitemap:` → novo domínio.
- [ ] `sitemap.xml`: a(s) `<loc>` → novo domínio (já existem desde o início — só
      trocar a URL, não recriar).
- [ ] Atualizar as URLs mencionadas no `README.md`.
- [ ] Nada a fazer com a URL antiga: `pgillets.github.io/simple_single_page_app/`
      passa a redirecionar (301) para o domínio novo automaticamente.

## 8. Solução de problemas

| Sintoma | Causa provável |
|---|---|
| DNS não verifica no Settings → Pages | Propagação ainda em andamento (pode levar até 24-48h); confira com `dig` se os registros já resolvem. |
| "Enforce HTTPS" continua cinza | O certificado ainda não foi emitido — normalmente resolve sozinho; verifique se há um CAA record bloqueando o Let's Encrypt. |
| Domínio abre mas mostra 404 do GitHub | O arquivo `CNAME` foi removido (algumas ferramentas de build/deploy o apagam); confirme que ele ainda existe na raiz da `main`. |
| Alguém "roubou" o subdomínio antigo | É por isso que o Passo 3 (verificação) deve ser feito antes de qualquer coisa. |
