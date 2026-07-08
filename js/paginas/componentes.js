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
        <div class="grade-cards" style="max-width: 22rem">
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
              <tr><td>Estilizável de fora</td><td>Só via <code>::part()</code> (não usado aqui)</td><td>Livremente, pelo CSS global</td></tr>
              <tr><td>Bom para</td><td>Componentes de UI fechados e portáveis</td><td>Peças que devem seguir o design do site</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}
