/*
 * Página #/roteamento — o roteador SPA explicando a si mesmo.
 */

export const titulo = "Roteamento";

export function render(outlet) {
  const suportaViewTransitions = "startViewTransition" in document;

  outlet.innerHTML = `
    <div class="pagina">
      <h1>Roteamento SPA sem framework</h1>
      <p class="lide">
        Você navega entre "páginas" e o documento nunca recarrega. Quem faz esse
        trabalho é o <code>js/roteador.js</code> — cerca de 70 linhas de JavaScript.
      </p>

      <section>
        <h2>Veja ao vivo</h2>
        <div class="bloco-demo">
          <p>O fragmento da URL neste momento é <code id="hash-atual"></code></p>
          <p>Troque de página pela navegação acima e observe: só o fragmento muda.
             O histórico do navegador funciona normalmente:</p>
          <div class="grupo-botoes">
            <button type="button" class="botao" id="botao-voltar">← Voltar</button>
            <button type="button" class="botao" id="botao-avancar">Avançar →</button>
            <a class="botao" href="#/uma-rota-que-nao-existe">Abrir uma rota inexistente</a>
          </div>
        </div>
      </section>

      <section>
        <h2>Como funciona</h2>
        <p>
          Cada rota vive depois do <code>#</code> na URL (<code>#/notas</code>,
          <code>#/canvas</code>…). O navegador dispara o evento
          <code>hashchange</code> a cada mudança; o roteador normaliza o fragmento,
          escolhe a vista correspondente num mapa de rotas e a renderiza no
          <code>&lt;main&gt;</code>. Título do documento, link ativo na navegação
          (<code>aria-current</code>), rolagem e foco são atualizados a cada troca —
          as quatro coisas que um framework faria por você.
        </p>
        <p>
          A transição animada entre páginas usa a <strong>View Transitions API</strong>
          nativa, como melhoria progressiva.
          Neste navegador: <span class="selo ${suportaViewTransitions ? "selo-ok" : "selo-aviso"}">
          ${suportaViewTransitions ? "suportada" : "não suportada (a troca é instantânea)"}</span>
        </p>
      </section>

      <section>
        <h2>Por que hash, e não a History API?</h2>
        <p>
          Com <code>pushState</code>, a URL <code>/notas</code> fica bonita — mas num
          servidor estático como o GitHub Pages um acesso direto a ela devolve
          <strong>404</strong>, porque o servidor não conhece as rotas da aplicação.
          O contorno clássico (um <code>404.html</code> que reescreve a URL e redireciona)
          funciona, mas é um hack: devolve status 404 para os buscadores e complica os
          caminhos relativos.
        </p>
        <p>
          Já o fragmento <code>#</code> nunca é enviado ao servidor: qualquer deep link
          cai em <code>index.html</code> e simplesmente funciona. De quebra, o documento
          "mora" sempre na raiz do site — o que mantém todos os caminhos relativos
          estáveis quando este site migrar de
          <code>/simple_single_page_app/</code> para um domínio próprio.
        </p>
      </section>

      <trecho-codigo arquivo="./js/roteador.js"></trecho-codigo>
    </div>
  `;

  const alvoHash = outlet.querySelector("#hash-atual");
  const atualizarHash = () => {
    alvoHash.textContent = location.hash || "(vazio)";
  };
  atualizarHash();
  addEventListener("hashchange", atualizarHash);

  outlet.querySelector("#botao-voltar").addEventListener("click", () => history.back());
  outlet.querySelector("#botao-avancar").addEventListener("click", () => history.forward());

  // Limpeza: sem isto, cada visita à página empilharia mais um listener global.
  return () => removeEventListener("hashchange", atualizarHash);
}
