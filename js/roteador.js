/*
 * roteador.js — roteamento SPA por hash, sem dependências.
 *
 * Por que hash (#/rota) e não a History API (pushState)? Num servidor
 * estático como o GitHub Pages, um acesso direto a /notas devolveria 404,
 * porque o servidor não conhece as rotas da aplicação. Já o fragmento (#)
 * nunca é enviado ao servidor: todo deep link cai em index.html e funciona.
 * Bônus: o documento "mora" sempre na raiz do site, então todos os caminhos
 * relativos (./css, ./js, fetch) são estáveis — inclusive quando o site
 * migrar de /simple_single_page_app/ para um domínio próprio.
 *
 * Contrato de cada vista (js/paginas/*.js):
 *   export const titulo = "Nome da página";
 *   export function render(outlet) { ... ; return limpeza?; }
 * A função de limpeza (opcional) roda antes da próxima troca de rota —
 * é onde a vista cancela fetches, animações e listeners globais.
 */

let rotas = {};
let vistaFallback = null;
let limpezaAtual = null;
let outlet = null;

export function definirRotas(mapa, fallback) {
  rotas = mapa;
  vistaFallback = fallback;
}

/**
 * Normaliza location.hash para um caminho de rota.
 * ""      -> "/"          (página inicial)
 * "#/"    -> "/"
 * "#/api" -> "/api"
 * "#conteudo" -> null     (âncora comum da página, ex.: o link "pular";
 *                          não é rota e o roteador a ignora)
 */
function caminhoDoHash() {
  const hash = location.hash;
  if (hash === "") return "/";
  if (!hash.startsWith("#/")) return null;
  let caminho = hash.slice(1);
  if (caminho.length > 1 && caminho.endsWith("/")) caminho = caminho.slice(0, -1);
  return caminho;
}

export function rotaAtual() {
  return caminhoDoHash() ?? "/";
}

function marcarLinkAtivo(caminho) {
  const links = document.querySelectorAll('.topo nav a, .rodape a[href^="#/"]');
  for (const link of links) {
    if (link.getAttribute("href") === `#${caminho}`) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

function renderizar() {
  const caminho = caminhoDoHash();
  if (caminho === null) return; // âncora nativa, não é assunto do roteador

  const vista = rotas[caminho] ?? vistaFallback;

  const trocar = () => {
    if (typeof limpezaAtual === "function") limpezaAtual();
    outlet.innerHTML = "";
    limpezaAtual = vista.render(outlet) ?? null;
    document.title = `${vista.titulo} · Stack Simples`;
    marcarLinkAtivo(caminho);
    window.scrollTo(0, 0);
    outlet.focus({ preventScroll: true });
  };

  // View Transitions API: melhoria progressiva — navegadores sem suporte
  // (ou visitantes que pedem menos movimento) trocam a rota sem animação.
  const reduzirMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (document.startViewTransition && !reduzirMovimento) {
    document.startViewTransition(trocar);
  } else {
    trocar();
  }
}

export function iniciarRoteador(elementoOutlet) {
  outlet = elementoOutlet;
  addEventListener("hashchange", renderizar);
  renderizar();
}
