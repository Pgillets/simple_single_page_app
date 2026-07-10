# Site institucional para PMEs — SEO-first, zero build

[![CI](https://github.com/pgillets/simple_single_page_app/actions/workflows/ci.yml/badge.svg)](https://github.com/pgillets/simple_single_page_app/actions/workflows/ci.yml)

**🇧🇷 Português** · [🇺🇸 English](#english)

🔗 **Exemplo no ar:** https://pgillets.github.io/simple_single_page_app/

Um template pronto para criar rapidamente o site de divulgação de uma pequena ou
média empresa — em HTML, CSS e JavaScript puros, **sem build, sem framework, sem
dependências**, hospedado de graça no GitHub Pages. O `index.html` deste repositório
já é um exemplo completo (uma clínica odontológica fictícia): troque o conteúdo pelo
da sua empresa e publique.

Feito para aparecer no Google: conteúdo estático (indexável sem depender de
JavaScript), meta tags de SEO, dados estruturados (schema.org) e sitemap já vêm prontos
— veja a seção [SEO](#seo) abaixo.

## As duas páginas deste template

| Página | Papel |
|---|---|
| **`index.html`** | O site institucional de verdade. Uma página só (início, serviços, sobre, depoimentos, contato), 100% estática — é o que buscadores e visitantes veem. **É aqui que você edita o conteúdo.** |
| **`tecnologia.html`** | Os bastidores técnicos: uma mini SPA que demonstra e explica, capacidade por capacidade, como o template funciona por dentro (roteamento, tema, Web Components, PWA...). Marcada como `noindex` — não compete com o site institucional na busca. |

## SEO

O que já vem pronto em `index.html`, prontos para você ajustar com os dados reais do
negócio:

- **Conteúdo 100% estático**: nada é montado por JavaScript — o HTML que o navegador
  recebe já é o conteúdo final. Funciona para buscadores, leitores de redes sociais e
  visitantes mesmo sem JS.
- **Meta tags completas**: `title`, `description`, `canonical`, Open Graph e Twitter
  Card — o essencial para aparecer bem tanto no Google quanto em compartilhamentos.
- **Dados estruturados (JSON-LD)**: um bloco `schema.org/Dentist` (subtipo de
  `LocalBusiness`) com nome, endereço, telefone e horário — ajuda o Google a mostrar
  essas informações direto no resultado de busca. Troque pelo tipo mais adequado ao
  seu negócio (veja a [lista de subtipos de `LocalBusiness`](https://schema.org/LocalBusiness)).
- **`robots.txt`** e **`sitemap.xml`**: já na raiz do repositório, apontando para
  `index.html` (o `tecnologia.html` fica de fora do sitemap de propósito).
- **Uma única página**: para o porte de site que este template atende, uma landing
  page completa costuma rankear melhor do que várias páginas finas — concentra
  autoridade e sinais de relevância numa URL só.

### Personalizando para o seu negócio

1. Edite `index.html`: nome, textos, serviços, depoimentos, endereço, telefone e
   horário. É HTML puro — não precisa entender o resto do repositório para isso.
2. Troque as cores em `css/tokens.css` (design tokens) e o `assets/favicon.svg`.
3. Gere uma imagem de Open Graph própria (1200×630) e salve em
   `assets/og-capa-negocio.png`, ou aponte `og:image`/o JSON-LD para outra.
4. Atualize `title`, `description`, `canonical`, `og:url`, `og:image` e os campos do
   JSON-LD em `index.html` com os dados reais.
5. Atualize a URL em `robots.txt` e em `sitemap.xml` (troque pelo seu domínio final).
6. Publique (veja abaixo) e, se quiser, configure um domínio próprio
   ([`docs/DOMINIO.md`](docs/DOMINIO.md)).

## Como funciona

- **`index.html` é só HTML/CSS**: o pouco JavaScript que carrega
  (`js/app-site.js`) só liga melhorias progressivas — tema claro/escuro, navegação
  que realça a seção visível, funcionamento offline — nunca o conteúdo em si.
- **`tecnologia.html` é uma SPA de verdade**, com roteamento por hash (`#/rota`) em
  vez de History API: o fragmento nunca chega ao servidor, então qualquer link direto
  funciona sem configuração nenhuma. Faz sentido aqui porque ninguém precisa achar
  essas páginas pelo Google — são documentação técnica, não conteúdo de negócio.
- **Zero build**: os módulos são ES Modules nativos, resolvidos pelo próprio
  navegador. `git push` é o deploy inteiro.
- **PWA discreta**: um service worker *network-first* garante que as duas páginas
  funcionem offline sem o efeito colateral clássico de "publiquei e ainda vejo a
  versão antiga".
- **Content-Security-Policy** estrita via `<meta>` — por isso não há nenhum script ou
  estilo inline em nenhuma das duas páginas (os dados estruturados JSON-LD são dado
  inerte, não código, e não precisam de exceção na CSP).

## Rodando localmente

ES Modules não funcionam abrindo os arquivos direto (`file://`) — é preciso um
servidor HTTP:

```bash
python3 tools/servidor.py
# site institucional: http://localhost:8000/
# bastidores técnicos: http://localhost:8000/tecnologia.html
```

Para simular exatamente como o site roda no GitHub Pages hoje (com o prefixo do
repositório na URL):

```bash
python3 tools/servidor.py --base simple_single_page_app
# abre em http://localhost:8000/simple_single_page_app/
```

Qualquer servidor estático serve (`npx serve`, `python3 -m http.server`); o script
acima só adiciona o tipo MIME correto do `.webmanifest`, desativa o cache HTTP (útil
ao mexer no service worker) e simula o 404.html do Pages.

## Publicando no GitHub Pages

1. O repositório precisa ser **público** (requisito do Pages gratuito).
2. **Settings → Pages → Build and deployment**: Source = **Deploy from a branch**,
   Branch = **`main`**, pasta = **`/ (root)`** → Save.
3. Em cerca de 1–2 minutos o site sobe em `https://<usuário>.github.io/<repositório>/`.
   Atenção: o GitHub Pages cacheia por até 10 minutos — uma mudança recém-publicada
   pode demorar um pouco para aparecer.

## Domínio personalizado

A ativação é um commit de uma linha: um arquivo `CNAME` na raiz com o domínio
escolhido. O passo a passo completo — verificação anti-sequestro, registros de DNS,
HTTPS, e o checklist de URLs (canonical, sitemap, robots.txt) para atualizar — está em
**[`docs/DOMINIO.md`](docs/DOMINIO.md)**. O código da aplicação não precisa de
nenhuma alteração: todos os caminhos internos já são relativos.

## Checklist de release

Ao publicar uma mudança que afete algum arquivo listado no `sw.js`, suba a constante
`VERSAO` nesse arquivo — é o gatilho que faz o service worker descartar o cache antigo
e avisar quem já tem o site aberto.

## Estrutura de arquivos

```
index.html        → O SITE: institucional, estático, uma página. Edite aqui.
tecnologia.html   → Bastidores técnicos (SPA de demonstração), noindex.
404.html, manifest.webmanifest, sw.js   → casca compartilhada e PWA
robots.txt, sitemap.xml                 → infraestrutura de SEO
css/
  tokens.css      → design tokens (cores, espaçamento, fontes) — troque as cores aqui
  base.css        → reset/layout compartilhado
  componentes.css → estilos reutilizados (nav, cards, botões...)
  negocio.css     → estilos exclusivos do index.html (hero, serviços, depoimentos...)
js/
  app-site.js     → entrada do index.html: tema + SW + realce de navegação
  app.js          → entrada do tecnologia.html: roteador + todas as vistas técnicas
  roteador.js, tema.js, tema-boot.js, sw-registro.js, github-api.js
                  → núcleo compartilhado
  componentes/    → Web Components (<demo-card>, <trecho-codigo>, <selo-status>, <estrela-avaliacao>)
  paginas/        → uma vista por rota de tecnologia.html
assets/           → favicon, ícones PWA, imagens de Open Graph
docs/DOMINIO.md   → runbook de domínio personalizado
tools/servidor.py → servidor de desenvolvimento (stdlib, sem dependências)
.github/workflows/ci.yml → validação de HTML e links a cada push/PR
```

## Licença

MIT — veja [`LICENSE`](LICENSE).

---

## English

A ready-to-use template for a small/medium business's promotional website — plain
HTML, CSS and JavaScript, **no build step, no framework, no dependencies**, hosted for
free on GitHub Pages. This repository's `index.html` is already a complete example (a
fictional dental clinic): replace the content with your own business and publish.

Built to rank: static content (indexable without depending on JavaScript), SEO meta
tags, structured data (schema.org) and a sitemap are already in place — see
[SEO](#seo-1) below.

**Live example:** https://pgillets.github.io/simple_single_page_app/

### The two pages

| Page | Role |
|---|---|
| **`index.html`** | The real business site. One page (home, services, about, testimonials, contact), fully static — what search engines and visitors see. **This is what you edit.** |
| **`tecnologia.html`** | The technical backstage: a small SPA demonstrating, capability by capability, how the template works internally. Marked `noindex` — it doesn't compete with the business site for ranking. |

### SEO

- **100% static content** — nothing is assembled by JavaScript; the HTML the browser
  receives is already the final content.
- **Full meta tags**: title, description, canonical, Open Graph, Twitter Card.
- **Structured data (JSON-LD)**: a `schema.org/Dentist` block (a `LocalBusiness`
  subtype) with name, address, phone and hours.
- **`robots.txt`** and **`sitemap.xml`** at the repo root, pointing at `index.html`
  (`tecnologia.html` is intentionally left out, since it's `noindex`).

### Customizing for your business

Edit `index.html`'s content and `css/tokens.css`'s colors, replace
`assets/og-capa-negocio.png`, update the meta tags and JSON-LD fields, then update the
URLs in `robots.txt`/`sitemap.xml` to your final domain.

### Highlights

- **`index.html` is just HTML/CSS**: the little JavaScript it loads
  (`js/app-site.js`) only wires progressive enhancements (theme, scroll-spy nav,
  offline support) — never the content itself.
- **`tecnologia.html` is a real SPA**, hash-routed rather than History-API-routed —
  appropriate here since nobody needs to find these pages via search.
- **Zero build**: native ES Modules, resolved by the browser itself.
- **A tame PWA**: a network-first service worker makes both pages work offline.
- **Strict Content-Security-Policy** via `<meta>` — the JSON-LD block is inert data,
  not code, so it needs no CSP exception.

### Local development

```bash
python3 tools/servidor.py                              # http://localhost:8000/
python3 tools/servidor.py --base simple_single_page_app # simulates the current
                                                          # GitHub Pages project-page URL
```

### Enabling GitHub Pages

Repository must be **public** (free-tier Pages requirement). Then: **Settings → Pages
→ Build and deployment** → Source: **Deploy from a branch** → Branch: **`main`**,
folder **`/ (root)`**. Live in ~1–2 minutes; GitHub's CDN caches responses for up to
10 minutes.

### Custom domain

Activation is a one-line commit (a `CNAME` file at the repo root). Full DNS/HTTPS
runbook, including the SEO-URL update checklist: [`docs/DOMINIO.md`](docs/DOMINIO.md)
(in Portuguese, with an English summary at the top).

### License

MIT — see [`LICENSE`](LICENSE).
