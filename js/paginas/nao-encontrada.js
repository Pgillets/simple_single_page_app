/*
 * Vista de rota desconhecida (o "404" interno da SPA).
 *
 * Não confundir com o 404.html da raiz: aquele responde a CAMINHOS
 * inexistentes no servidor; este responde a FRAGMENTOS (#/rota) que a
 * aplicação não conhece. A URL errada permanece na barra de endereço de
 * propósito — é honesto e ajuda a depurar.
 */

export const titulo = "Página não encontrada";

export function render(outlet) {
  outlet.innerHTML = `
    <div class="pagina">
      <h1>Página não encontrada</h1>
      <p class="lide">A rota <code id="rota-tentada"></code> não existe nesta aplicação.</p>
      <div class="grupo-botoes">
        <a class="botao botao-primario" href="#/">Ir para o início</a>
        <a class="botao" href="#/roteamento">Entender o roteamento</a>
      </div>
    </div>
  `;

  // textContent (nunca innerHTML): o fragmento vem da URL, ou seja, de fora.
  outlet.querySelector("#rota-tentada").textContent = location.hash;
}
