/*
 * sw.js — service worker do "app shell", na raiz do repositório de propósito:
 * o escopo padrão de um service worker é o diretório de onde ele é servido,
 * então ficar na raiz garante escopo = base do site tanto em
 * /simple_single_page_app/ (project page) quanto em / (domínio próprio).
 *
 * Estratégia: NETWORK-FIRST para tudo same-origin (navegação e assets do
 * shell), com fallback ao cache. O GitHub Pages já manda os arquivos com
 * Cache-Control: max-age=600 — um service worker cache-first empilharia
 * mais uma camada de staleness em cima disso. Network-first elimina o
 * clássico "publiquei e continuo vendo a versão antiga".
 *
 * A API do GitHub (cross-origin) nunca é interceptada: passa direto.
 *
 * Ao publicar uma mudança em qualquer arquivo do PRECACHE, suba a VERSAO —
 * é o gatilho que faz o activate() descartar o cache antigo.
 */

const VERSAO = "v4";
const CACHE = `shell-${VERSAO}`;

const PRECACHE = [
  "./",
  "./index.html",
  "./tecnologia.html",
  "./404.html",
  "./manifest.webmanifest",
  "./css/tokens.css",
  "./css/base.css",
  "./css/componentes.css",
  "./css/negocio.css",
  "./js/tema-boot.js",
  "./js/app.js",
  "./js/app-site.js",
  "./js/roteador.js",
  "./js/tema.js",
  "./js/github-api.js",
  "./js/sw-registro.js",
  "./js/componentes/demo-card.js",
  "./js/componentes/trecho-codigo.js",
  "./js/componentes/selo-status.js",
  "./js/componentes/estrela-avaliacao.js",
  "./js/paginas/inicio.js",
  "./js/paginas/roteamento.js",
  "./js/paginas/tema.js",
  "./js/paginas/componentes.js",
  "./js/paginas/canvas.js",
  "./js/paginas/api.js",
  "./js/paginas/notas.js",
  "./js/paginas/offline.js",
  "./js/paginas/sobre.js",
  "./js/paginas/nao-encontrada.js",
  "./assets/favicon.svg",
  "./assets/icones/icone-192.png",
  "./assets/icones/icone-512.png",
  "./assets/og-capa-negocio.png",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // cache: "reload" fura o cache HTTP do navegador — sem isso, o
      // max-age=600 do GitHub Pages poderia precachear conteúdo já obsoleto.
      await Promise.all(
        PRECACHE.map(async (caminho) => {
          const url = new URL(caminho, self.location);
          try {
            const resposta = await fetch(url, { cache: "reload" });
            if (resposta.ok) await cache.put(url, resposta);
          } catch {
            /* recurso opcional indisponível durante o install; segue sem ele */
          }
        })
      );
    })()
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    (async () => {
      const chaves = await caches.keys();
      await Promise.all(chaves.filter((chave) => chave !== CACHE).map((chave) => caches.delete(chave)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (evento) => {
  if (evento.data?.tipo === "PULAR_ESPERA") self.skipWaiting();
});

self.addEventListener("fetch", (evento) => {
  const requisicao = evento.request;
  if (requisicao.method !== "GET") return;

  const url = new URL(requisicao.url);
  if (url.origin !== self.location.origin) return; // API do GitHub e afins: passam direto

  evento.respondWith(networkFirst(requisicao));
});

async function networkFirst(requisicao) {
  const cache = await caches.open(CACHE);
  try {
    const resposta = await fetch(requisicao);
    if (resposta.ok) cache.put(requisicao, resposta.clone());
    return resposta;
  } catch (erro) {
    const emCache = await cache.match(requisicao, { ignoreSearch: true });
    if (emCache) return emCache;
    if (requisicao.mode === "navigate") {
      // Duas cascas possíveis: tecnologia.html tem sua própria SPA por
      // dentro (roteador com várias rotas); qualquer outro caminho é o
      // site institucional (index.html), incluindo "/" e "/index.html".
      const paginaTecnica = new URL(requisicao.url).pathname.endsWith("tecnologia.html");
      const casca = await cache.match(paginaTecnica ? "./tecnologia.html" : "./index.html");
      if (casca) return casca;
    }
    throw erro;
  }
}
