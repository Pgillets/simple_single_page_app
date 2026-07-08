# Stack Simples — SPA no GitHub Pages

[![CI](https://github.com/pgillets/simple_single_page_app/actions/workflows/ci.yml/badge.svg)](https://github.com/pgillets/simple_single_page_app/actions/workflows/ci.yml)

**🇧🇷 Português** · [🇺🇸 English](#english)

🔗 **Site no ar:** https://pgillets.github.io/simple_single_page_app/

Uma *single page application* em HTML, CSS e JavaScript puros — **sem build, sem
framework, sem dependências** — hospedada de graça no GitHub Pages. O próprio site é o
argumento: cada página demonstra e explica, em português, uma capacidade da plataforma
web moderna.

## O que este site demonstra

| Rota | Capacidade |
|---|---|
| `#/` | Visão geral e responsividade sem CSS framework |
| `#/roteamento` | Roteamento SPA por hash + View Transitions API |
| `#/tema` | Tema claro/escuro com CSS custom properties + `prefers-color-scheme` + `localStorage` |
| `#/componentes` | Web Components: shadow DOM vs. light DOM |
| `#/canvas` | Animação de partículas com Canvas 2D + `requestAnimationFrame` |
| `#/api` | Dados ao vivo do próprio repositório via API do GitHub, sem backend |
| `#/notas` | Persistência local (`localStorage`) com sincronização entre abas |
| `#/offline` | PWA: manifesto, service worker, instalação e uso offline |
| `#/sobre` | A filosofia do projeto e como publicar o seu igual |

## Como funciona

- **Roteamento por hash (`#/rota`)**, não History API. O fragmento nunca chega ao
  servidor, então qualquer link direto funciona sem nenhuma configuração — e o
  documento HTML "mora" sempre na raiz do site, o que mantém todos os caminhos
  relativos (CSS, JS, `fetch`) estáveis mesmo quando a base do site muda (ver domínio
  personalizado abaixo).
- **Zero build**: os módulos são ES Modules nativos, resolvidos pelo próprio
  navegador. `git push` é o deploy inteiro.
- **PWA discreta**: um service worker *network-first* garante que o site funcione
  offline sem o efeito colateral clássico de "publiquei e ainda vejo a versão antiga".
- **Content-Security-Policy** estrita via `<meta>` — por isso não há nenhum script ou
  estilo inline no `index.html`.

## Rodando localmente

ES Modules não funcionam abrindo o `index.html` direto (`file://`) — é preciso um
servidor HTTP:

```bash
python3 tools/servidor.py
# abre em http://localhost:8000/
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
HTTPS — está em **[`docs/DOMINIO.md`](docs/DOMINIO.md)**. O código da aplicação não
precisa de nenhuma alteração: todos os caminhos internos já são relativos.

## Checklist de release

Ao publicar uma mudança que afete algum arquivo listado no `sw.js`, suba a constante
`VERSAO` nesse arquivo — é o gatilho que faz o service worker descartar o cache antigo
e avisar quem já tem o site aberto.

## Estrutura de arquivos

```
index.html, 404.html, manifest.webmanifest, sw.js   → casca da aplicação e PWA
css/            → tokens.css (design tokens), base.css (reset/layout), componentes.css
js/
  roteador.js, tema.js, tema-boot.js, app.js         → núcleo da SPA
  github-api.js, sw-registro.js                      → integrações
  componentes/    → Web Components (<demo-card>, <trecho-codigo>)
  paginas/        → uma vista por rota
assets/         → favicon, ícones PWA, imagem de Open Graph
docs/DOMINIO.md → runbook de domínio personalizado
tools/servidor.py → servidor de desenvolvimento (stdlib, sem dependências)
.github/workflows/ci.yml → validação de HTML e links a cada push/PR
```

## Licença

MIT — veja [`LICENSE`](LICENSE).

---

## English

A single page application in plain HTML, CSS and JavaScript — **no build step, no
framework, no dependencies** — hosted for free on GitHub Pages. The site itself is the
argument: every page both demonstrates and explains (in Brazilian Portuguese) one
capability of the modern web platform.

**Live site:** https://pgillets.github.io/simple_single_page_app/

### Highlights

- **Hash-based routing** (`#/route`), not the History API: the fragment never reaches
  the server, so every deep link works with zero server configuration, and the HTML
  document always stays at the site root — keeping every relative path (CSS, JS,
  `fetch`) stable even when the site's base path changes later (see custom domain).
- **Zero build**: native ES Modules, resolved by the browser itself. `git push` is the
  entire deployment.
- **A tame PWA**: a network-first service worker makes the site work offline without
  the classic "I shipped an update and still see the old version" problem.
- **Strict Content-Security-Policy** via `<meta>` — hence zero inline scripts/styles
  in `index.html`.

### Local development

ES Modules don't work by opening `index.html` directly (`file://`) — you need an HTTP
server:

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
runbook: [`docs/DOMINIO.md`](docs/DOMINIO.md) (in Portuguese, with an English summary
at the top). No application code changes are required — every internal path is
already relative.

### License

MIT — see [`LICENSE`](LICENSE).
