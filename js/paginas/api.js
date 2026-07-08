/*
 * Página #/api — dados dinâmicos num site 100% estático.
 */

import {
  buscarDadosDoRepo,
  buscarCommitsRecentes,
  formatarNumero,
  formatarDataHora,
  formatarRelativo,
  REPO,
} from "../github-api.js";

export const titulo = "API ao vivo";

export function render(outlet) {
  outlet.innerHTML = `
    <div class="pagina">
      <h1>Dados ao vivo, sem backend</h1>
      <p class="lide">
        Esta página faz <code>fetch</code> direto na API pública do GitHub e mostra
        estatísticas <strong>deste mesmo repositório</strong> — ${REPO}.
      </p>

      <div class="bloco-demo" id="area-stats" aria-live="polite">
        <p class="vazio">Carregando estatísticas…</p>
      </div>

      <section>
        <h2>Commits recentes</h2>
        <div class="bloco-demo" id="area-commits" aria-live="polite">
          <p class="vazio">Carregando commits…</p>
        </div>
      </section>

      <section>
        <h2>Como isso é possível sem servidor</h2>
        <p>
          O navegador do visitante faz a requisição diretamente para
          <code>api.github.com</code> — não existe backend próprio. O detalhe fino é o
          limite de <strong>60 requisições por hora por IP</strong> para chamadas
          anônimas. Três defesas cuidam disso, implementadas em
          <code>js/github-api.js</code>:
        </p>
        <ol>
          <li>cache em <code>localStorage</code> válido por 1 hora;</li>
          <li>requisição condicional com <code>ETag</code> — uma resposta
              <code>304 Not Modified</code> não consome o limite;</li>
          <li>se a rede falhar ou o limite estourar, a página mostra o último dado bom
              conhecido, com a hora em que foi obtido.</li>
        </ol>
      </section>

      <trecho-codigo arquivo="./js/github-api.js"></trecho-codigo>
    </div>
  `;

  const controlador = new AbortController();
  const areaStats = outlet.querySelector("#area-stats");
  const areaCommits = outlet.querySelector("#area-commits");

  function bannerErro(mensagem) {
    return `<p class="selo selo-aviso">${mensagem}</p>`;
  }

  function legendaCache(resultado) {
    if (!resultado.deCache) return "";
    return `<p class="stat-rotulo">Dados em cache, obtidos ${formatarDataHora(resultado.quando)}.</p>`;
  }

  buscarDadosDoRepo(controlador.signal)
    .then((resultado) => {
      const repo = resultado.dados;
      areaStats.innerHTML = `
        <div class="grade-stats">
          <div class="stat"><span class="stat-rotulo">Estrelas</span><span class="stat-valor">${formatarNumero(repo.stargazers_count)}</span></div>
          <div class="stat"><span class="stat-rotulo">Forks</span><span class="stat-valor">${formatarNumero(repo.forks_count)}</span></div>
          <div class="stat"><span class="stat-rotulo">Issues abertas</span><span class="stat-valor">${formatarNumero(repo.open_issues_count)}</span></div>
          <div class="stat"><span class="stat-rotulo">Linguagem</span><span class="stat-valor">${repo.language ?? "—"}</span></div>
        </div>
        ${legendaCache(resultado)}
      `;
    })
    .catch((erro) => {
      if (erro.name === "AbortError") return;
      const motivo = erro.message === "rate-limit"
        ? "Limite de requisições da API do GitHub atingido por agora."
        : "Não foi possível carregar as estatísticas.";
      areaStats.innerHTML = bannerErro(motivo);
    });

  buscarCommitsRecentes(controlador.signal)
    .then((resultado) => {
      const commits = resultado.dados;
      const itens = commits
        .map((c) => {
          const mensagem = c.commit.message.split("\n")[0];
          const quando = formatarRelativo(c.commit.author.date);
          return `<li><span class="msg"></span><span class="meta">${quando}</span></li>`;
        })
        .join("");
      areaCommits.innerHTML = `<ul class="lista-commits">${itens}</ul>${legendaCache(resultado)}`;
      // Mensagens de commit vêm de fora (texto livre) — sempre textContent.
      areaCommits.querySelectorAll(".msg").forEach((el, i) => {
        el.textContent = commits[i].commit.message.split("\n")[0];
      });
    })
    .catch((erro) => {
      if (erro.name === "AbortError") return;
      areaCommits.innerHTML = bannerErro("Não foi possível carregar os commits.");
    });

  // Limpeza: cancela as requisições em voo se o visitante trocar de página antes de responderem.
  return () => controlador.abort();
}
