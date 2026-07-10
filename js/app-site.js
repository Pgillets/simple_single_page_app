/*
 * app-site.js — ponto de entrada do site INSTITUCIONAL (index.html).
 *
 * De propósito bem mais magro que js/app.js: nenhum roteador, nenhuma vista,
 * nenhum Web Component. O conteúdo do site já está todo no HTML — só liga
 * três melhorias progressivas por cima dele: tema, navegação realçada por
 * seção visível (scroll-spy) e funcionamento offline.
 */

import { iniciarTema } from "./tema.js";
import { registrarServiceWorker } from "./sw-registro.js";

iniciarTema(document.getElementById("alternar-tema"));
registrarServiceWorker();

/*
 * Scroll-spy: marca o link da navegação correspondente à seção que está
 * visível na tela, com IntersectionObserver — sem escutar "scroll" e sem
 * recalcular posições a cada frame.
 */
const secoes = document.querySelectorAll("main > section[id]");
const links = document.querySelectorAll(".topo nav a");

function marcarLinkAtivo(id) {
  for (const link of links) {
    const ativo = link.getAttribute("href") === `#${id}`;
    link.toggleAttribute("aria-current", ativo);
    if (ativo) link.setAttribute("aria-current", "page");
  }
}

if (secoes.length && "IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    (entradas) => {
      // Entre as seções parcialmente visíveis, marca a que ocupa mais tela —
      // evita o link "pular" entre duas seções próximas durante a rolagem.
      const maisVisivel = entradas
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (maisVisivel) marcarLinkAtivo(maisVisivel.target.id);
    },
    { rootMargin: "-40% 0px -40% 0px" } // considera "visível" perto do centro da tela
  );
  secoes.forEach((secao) => observador.observe(secao));
}
