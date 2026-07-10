/*
 * Página #/componentes — Web Components sem framework.
 */

export const titulo = "Componentes";

export function render(outlet) {
  outlet.innerHTML = `
    <div class="pagina">
      <h1>Componentização nativa</h1>
      <p class="lide">
        <code>customElements.define()</code> transforma uma classe em uma tag HTML de
        verdade — reutilizável, com ciclo de vida próprio, sem nenhuma biblioteca.
      </p>

      <section>
        <h2>Com shadow DOM: &lt;demo-card&gt;</h2>
        <p>
          O card abaixo é o mesmo componente usado na página inicial. O CSS de dentro
          dele vive isolado em uma <em>shadow root</em> — não vaza para a página e o
          CSS da página não invade o componente. A única coisa que atravessa essa
          fronteira, de propósito, são as <strong>custom properties</strong>: é assim
          que o tema claro/escuro chega lá dentro.
        </p>
        <div class="grade-cards grade-cards--estreita">
          <demo-card href="#/tema">
            <span slot="icone">🌗</span>
            <span slot="titulo">Exemplo de card</span>
            Este texto veio por um &lt;slot&gt; sem nome; o ícone e o título vieram de
            slots nomeados.
          </demo-card>
        </div>
        <trecho-codigo arquivo="./js/componentes/demo-card.js"></trecho-codigo>
      </section>

      <section>
        <h2>Sem shadow DOM: &lt;trecho-codigo&gt;</h2>
        <p>
          Já o componente que está exibindo o código nesta mesma página é
          <em>light DOM</em> — sem shadow root. Ele herda o CSS global normalmente
          (é por isso que combina com o resto do site sem esforço), em troca de abrir
          mão do isolamento de estilos. A escolha entre os dois é a mesma que existe em
          qualquer sistema de design: encapsulamento contra herança de estilos.
        </p>
        <trecho-codigo arquivo="./js/componentes/trecho-codigo.js"></trecho-codigo>
      </section>

      <section>
        <h2>Tabela comparativa</h2>
        <div class="rolagem-x">
          <table>
            <thead>
              <tr><th></th><th>Shadow DOM (&lt;demo-card&gt;)</th><th>Light DOM (&lt;trecho-codigo&gt;)</th></tr>
            </thead>
            <tbody>
              <tr><td>Isolamento de CSS</td><td>Total</td><td>Nenhum</td></tr>
              <tr><td>Herda o tema (custom properties)</td><td>Sim, atravessam o shadow</td><td>Sim, direto</td></tr>
              <tr><td>Estilizável de fora</td><td>Só via <code>::part()</code> — veja abaixo</td><td>Livremente, pelo CSS global</td></tr>
              <tr><td>Bom para</td><td>Componentes de UI fechados e portáveis</td><td>Peças que devem seguir o design do site</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Atributos reativos e <code>::part()</code>: &lt;selo-status&gt;</h2>
        <p>
          O <code>&lt;demo-card&gt;</code> só renderiza uma vez, no construtor — se você
          mudar o conteúdo dos seus slots depois, ele não percebe sozinho. Já
          <code>&lt;selo-status&gt;</code> declara <code>observedAttributes</code>: o
          navegador chama <code>attributeChangedCallback()</code> sempre que
          <code>status</code> ou <code>texto</code> mudam, e o componente se redesenha
          na hora — sem recriar o elemento.
        </p>
        <div class="linha-selos-demo" id="demo-selos">
          <selo-status status="ok" texto="Publicado"></selo-status>
          <selo-status status="aviso" texto="Revisão pendente"></selo-status>
          <selo-status status="erro" texto="Falhou"></selo-status>
        </div>
        <div class="grupo-botoes">
          <button type="button" class="botao" id="botao-mudar-selo">Mudar o 1º selo por código</button>
        </div>
        <p>
          Repare também no CSS desta página: <code>.demo-selo-customizado::part(selo)</code>
          estiliza o selo abaixo (borda tracejada, texto maiúsculo) vindo de <em>fora</em>
          do shadow DOM — algo impossível sem o atributo <code>part</code> ser
          explicitamente declarado dentro do componente:
        </p>
        <div class="linha-selos-demo">
          <selo-status class="demo-selo-customizado" status="ok" texto="Estilizado de fora"></selo-status>
        </div>
        <trecho-codigo arquivo="./js/componentes/selo-status.js"></trecho-codigo>
      </section>

      <section>
        <h2>Eventos customizados e acessibilidade: &lt;estrela-avaliacao&gt;</h2>
        <p>
          Este widget segue o mesmo fluxo de dados de qualquer componente de
          framework — atributo desce, evento sobe — só que com APIs nativas do
          navegador. Clique numa estrela ou foque o grupo e use as setas do teclado
          (segue o padrão ARIA <code>radiogroup</code>, com <em>roving tabindex</em>):
        </p>
        <div class="demo-avaliacao">
          <estrela-avaliacao valor="3" id="demo-avaliacao"></estrela-avaliacao>
          <p id="texto-avaliacao">Você avaliou: 3 de 5.</p>
        </div>
        <p>
          Cada clique dispara um <code>CustomEvent("mudanca", &#123; bubbles: true,
          composed: true &#125;)</code> — o <code>composed: true</code> é o que permite ao
          evento atravessar a fronteira do shadow DOM e chegar a um listener do lado
          de fora, como o que atualiza o texto acima.
        </p>
        <trecho-codigo arquivo="./js/componentes/estrela-avaliacao.js"></trecho-codigo>
      </section>
    </div>
  `;

  const botaoMudarSelo = outlet.querySelector("#botao-mudar-selo");
  const primeiroSelo = outlet.querySelector("#demo-selos selo-status");
  const estados = [
    { status: "ok", texto: "Publicado" },
    { status: "aviso", texto: "Em revisão" },
    { status: "erro", texto: "Removido" },
  ];
  let indice = 0;
  botaoMudarSelo.addEventListener("click", () => {
    indice = (indice + 1) % estados.length;
    // Muda só os atributos — quem redesenha o componente é o próprio
    // attributeChangedCallback dele, não este código aqui fora.
    primeiroSelo.status = estados[indice].status;
    primeiroSelo.texto = estados[indice].texto;
  });

  const avaliacao = outlet.querySelector("#demo-avaliacao");
  const textoAvaliacao = outlet.querySelector("#texto-avaliacao");
  const aoAvaliar = (evento) => {
    textoAvaliacao.textContent = `Você avaliou: ${evento.detail.valor} de 5.`;
  };
  avaliacao.addEventListener("mudanca", aoAvaliar);

  return () => avaliacao.removeEventListener("mudanca", aoAvaliar);
}
