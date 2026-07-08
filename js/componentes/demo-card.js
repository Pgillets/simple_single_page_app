/*
 * <demo-card> — Web Component com shadow DOM.
 *
 * Demonstra componentização sem framework:
 *   - shadow DOM: o CSS de dentro não vaza, o de fora não entra;
 *   - <slot>: composição declarativa de conteúdo;
 *   - custom properties: a ÚNICA coisa que atravessa a fronteira do shadow
 *     por design — é assim que o tema claro/escuro chega aqui dentro;
 *   - Constructable Stylesheets (adoptedStyleSheets): estilos via CSSOM,
 *     que — ao contrário de um <style> inline — convivem com a CSP estrita
 *     deste site (default-src 'self', sem 'unsafe-inline').
 *
 * Uso:
 *   <demo-card href="#/canvas">
 *     <span slot="icone">🎨</span>
 *     <span slot="titulo">Canvas</span>
 *     Texto descritivo do card.
 *   </demo-card>
 */

const folha = new CSSStyleSheet();
folha.replaceSync(`
  :host {
    display: block;
  }
  a {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    height: 100%;
    background: var(--cor-superficie, #fff);
    border: 1px solid var(--cor-borda, #ddd);
    border-radius: var(--raio, 12px);
    padding: 1.1rem 1.2rem;
    text-decoration: none;
    color: var(--cor-texto, inherit);
    box-shadow: var(--sombra, none);
    transition: translate var(--duracao, 180ms), border-color var(--duracao, 180ms);
  }
  a:hover {
    translate: 0 -3px;
    border-color: var(--cor-destaque, #4f46e5);
  }
  a:focus-visible {
    outline: 2px solid var(--cor-destaque, #4f46e5);
    outline-offset: 2px;
  }
  .icone {
    font-size: 1.5rem;
    line-height: 1;
  }
  h3 {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.3;
  }
  p {
    margin: 0;
    flex: 1;
    color: var(--cor-texto-suave, #666);
    font-size: 0.92rem;
    line-height: 1.55;
  }
  .chamada {
    color: var(--cor-destaque-forte, #4338ca);
    font-size: 0.88rem;
    font-weight: 600;
  }
`);

class DemoCard extends HTMLElement {
  constructor() {
    super();
    const raiz = this.attachShadow({ mode: "open" });
    raiz.adoptedStyleSheets = [folha];
    raiz.innerHTML = `
      <a>
        <span class="icone"><slot name="icone"></slot></span>
        <h3><slot name="titulo"></slot></h3>
        <p><slot></slot></p>
        <span class="chamada">Ver demonstração →</span>
      </a>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector("a").setAttribute("href", this.getAttribute("href") ?? "#/");
  }
}

customElements.define("demo-card", DemoCard);
