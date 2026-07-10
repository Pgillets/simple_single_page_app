/*
 * app-site.js — ponto de entrada do site INSTITUCIONAL (index.html).
 *
 * Bem mais magro que js/app.js: nenhum roteador, nenhuma vista. O conteúdo
 * do site já está todo no HTML — isto aqui só liga melhorias progressivas
 * por cima dele: tema, navegação realçada por seção visível (scroll-spy),
 * funcionamento offline e dois Web Components dos bastidores técnicos
 * (tecnologia.html) reaproveitados aqui, onde fazem sentido como reforço
 * visual de dado que já está em texto estático na página.
 */

import { iniciarTema } from "./tema.js";
import { registrarServiceWorker } from "./sw-registro.js";

// <estrela-avaliacao> (decorativo, somente-leitura, valor fixo no HTML) e
// <selo-status> (calculado abaixo) — importar já registra as duas tags.
import "./componentes/selo-status.js";
import "./componentes/estrela-avaliacao.js";

iniciarTema(document.getElementById("alternar-tema"));
registrarServiceWorker();

/*
 * "Aberto agora" / "Fechado no momento": calculado de verdade a partir do
 * horário de funcionamento, não decorativo. Mesmo horário do
 * "openingHoursSpecification" no JSON-LD de index.html — mantenha os dois
 * em sincronia ao personalizar para outro negócio.
 *
 * Simplificação assumida: usa o horário LOCAL do navegador de quem visita,
 * não o fuso do negócio — razoável para um público majoritariamente local,
 * mas vale ajustar se o público-alvo for outro fuso.
 */
const HORARIO_FUNCIONAMENTO = {
  diasDaSemana: [1, 2, 3, 4, 5], // 0 = domingo ... 6 = sábado; aqui, segunda a sexta
  abre: 9, // 09:00
  fecha: 18, // 18:00
};

function calcularStatusFuncionamento() {
  const agora = new Date();
  const diaAtual = agora.getDay();
  const horaAtual = agora.getHours() + agora.getMinutes() / 60;
  const aberto =
    HORARIO_FUNCIONAMENTO.diasDaSemana.includes(diaAtual) &&
    horaAtual >= HORARIO_FUNCIONAMENTO.abre &&
    horaAtual < HORARIO_FUNCIONAMENTO.fecha;
  return aberto ? { status: "ok", texto: "Aberto agora" } : { status: "erro", texto: "Fechado no momento" };
}

const seloHorario = document.getElementById("selo-horario");
if (seloHorario) {
  const { status, texto } = calcularStatusFuncionamento();
  seloHorario.status = status;
  seloHorario.texto = texto;
}

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
