/*
 * Página #/tema — design tokens, prefers-color-scheme e persistência.
 */

import { alternarTema, seguirSistema, temaAtual, temaSalvo } from "../tema.js";

export const titulo = "Tema";

const TOKENS = [
  "--cor-fundo",
  "--cor-superficie",
  "--cor-texto",
  "--cor-texto-suave",
  "--cor-destaque",
  "--cor-borda",
  "--cor-ok",
  "--cor-erro",
];

export function render(outlet) {
  outlet.innerHTML = `
    <div class="pagina">
      <h1>Tema claro e escuro com CSS puro</h1>
      <p class="lide">
        Todo o visual do site nasce de design tokens — CSS custom properties definidas
        em <code>css/tokens.css</code>. Trocar de tema é trocar meia dúzia de variáveis.
      </p>

      <section>
        <h2>Experimente</h2>
        <div class="bloco-demo">
          <p id="estado-tema"></p>
          <div class="grupo-botoes">
            <button type="button" class="botao botao-primario" id="botao-alternar">Alternar tema</button>
            <button type="button" class="botao" id="botao-sistema">Voltar a seguir o sistema</button>
          </div>
          <p>Dica: sem escolha salva, mude o tema do seu sistema operacional e veja o site
             acompanhar em tempo real.</p>
        </div>
      </section>

      <section>
        <h2>Os tokens, ao vivo</h2>
        <p>As amostras abaixo apontam para as variáveis (<code>var(--token)</code>) —
           alternando o tema, elas mudam sozinhas, sem nenhum JavaScript envolvido:</p>
        <div class="grade-amostras" id="amostras"></div>
      </section>

      <section>
        <h2>Como funciona</h2>
        <p>São três camadas, da mais fraca para a mais forte:</p>
        <ol>
          <li><strong>Sistema</strong>: <code>@media (prefers-color-scheme: dark)</code>
              redefine os tokens quando o sistema está no escuro.</li>
          <li><strong>Escolha do visitante</strong>: o botão grava
              <code>data-tema="claro|escuro"</code> no <code>&lt;html&gt;</code> e persiste
              em <code>localStorage</code>.</li>
          <li><strong>Anti-flash</strong>: um script mínimo e bloqueante no
              <code>&lt;head&gt;</code> (<code>js/tema-boot.js</code>) reaplica a escolha
              salva <em>antes do primeiro paint</em> — sem clarão de tema errado.</li>
        </ol>
      </section>

      <trecho-codigo arquivo="./js/tema.js"></trecho-codigo>
      <trecho-codigo arquivo="./css/tokens.css"></trecho-codigo>
    </div>
  `;

  // Amostras: cada cor vem de uma classe (.amostra-cor.fundo, .ok, ...) que
  // referencia var(--token) no CSS — não de JS setando "style" no elemento.
  // A CSP deste site (default-src 'self', sem style-src próprio) bloqueia
  // qualquer estilo inline, incluindo element.style.setProperty() feito por
  // script; expressar a cor como classe mantém a demonstração 100% CSS (é
  // por isso que muda sozinha ao trocar de tema, sem nenhum JS envolvido).
  const grade = outlet.querySelector("#amostras");
  for (const token of TOKENS) {
    const figura = document.createElement("figure");
    figura.className = "amostra";
    const cor = document.createElement("div");
    cor.className = `amostra-cor ${token.replace("--cor-", "")}`;
    const legenda = document.createElement("figcaption");
    legenda.textContent = token;
    figura.append(cor, legenda);
    grade.append(figura);
  }

  const estado = outlet.querySelector("#estado-tema");
  const atualizarEstado = () => {
    const salvo = temaSalvo();
    estado.textContent = salvo
      ? `Escolha salva em localStorage: tema ${salvo}.`
      : `Nenhuma escolha salva — seguindo o sistema (${temaAtual()} agora).`;
  };
  atualizarEstado();

  outlet.querySelector("#botao-alternar").addEventListener("click", () => {
    alternarTema();
    atualizarEstado();
  });
  outlet.querySelector("#botao-sistema").addEventListener("click", () => {
    seguirSistema();
    atualizarEstado();
  });

  // O botão do cabeçalho também muda o tema: um MutationObserver no <html>
  // mantém o texto de estado em dia venha a mudança de onde vier.
  const observador = new MutationObserver(atualizarEstado);
  observador.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema"] });

  return () => observador.disconnect();
}
