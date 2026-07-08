/*
 * <trecho-codigo> — o site exibe o próprio código-fonte.
 *
 * Web Component de LIGHT DOM (sem shadow), de propósito: ele é estilizado
 * pelo CSS global (css/componentes.css), em contraste com o <demo-card>,
 * que se isola em shadow DOM. Os dois juntos contam a história completa
 * de componentização na página #/componentes.
 *
 * O arquivo é buscado com fetch() usando caminho relativo ao documento —
 * estável porque, com roteamento por hash, o documento nunca sai da raiz
 * do site. A busca é preguiçosa: só acontece quando o <details> é aberto
 * pela primeira vez.
 *
 * Uso: <trecho-codigo arquivo="./js/roteador.js"></trecho-codigo>
 */

class TrechoCodigo extends HTMLElement {
  connectedCallback() {
    if (this.dataset.iniciado) return;
    this.dataset.iniciado = "true";

    const arquivo = this.getAttribute("arquivo");
    if (!arquivo) return;

    const detalhes = document.createElement("details");
    const resumo = document.createElement("summary");
    resumo.append("Ver o código: ");
    const nome = document.createElement("code");
    nome.textContent = arquivo.replace("./", "");
    resumo.append(nome);

    const barra = document.createElement("div");
    barra.className = "barra";
    const dica = document.createElement("span");
    dica.textContent = "Direto do repositório, via fetch()";
    const copiar = document.createElement("button");
    copiar.type = "button";
    copiar.className = "botao";
    copiar.textContent = "Copiar";
    barra.append(dica, copiar);

    const pre = document.createElement("pre");
    const codigo = document.createElement("code");
    pre.append(codigo);

    detalhes.append(resumo, barra, pre);
    this.append(detalhes);

    let carregado = false;
    detalhes.addEventListener("toggle", async () => {
      if (!detalhes.open || carregado) return;
      carregado = true;
      codigo.textContent = "Carregando…";
      try {
        const resposta = await fetch(arquivo);
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        // textContent, nunca innerHTML: o conteúdo vira texto, jamais markup.
        codigo.textContent = await resposta.text();
      } catch (erro) {
        codigo.textContent = `Não foi possível carregar ${arquivo} (${erro.message}).`;
      }
    });

    copiar.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(codigo.textContent);
        copiar.textContent = "Copiado!";
      } catch {
        copiar.textContent = "Sem permissão";
      }
      setTimeout(() => {
        copiar.textContent = "Copiar";
      }, 2000);
    });
  }
}

customElements.define("trecho-codigo", TrechoCodigo);
