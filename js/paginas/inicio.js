/*
 * Página inicial dos bastidores técnicos — a tese do projeto e o mapa
 * das demonstrações. Não é mais a porta de entrada do site: quem chega
 * em "/" (fora do hash) vê o site institucional real; esta página vive
 * em tecnologia.html e explica como ele foi construído por dentro.
 */

export const titulo = "Início";

export function render(outlet) {
  outlet.innerHTML = `
    <div class="pagina">
      <section class="heroi">
        <h1>Simples de verdade. <span class="texto-gradiente">Poderosa de verdade.</span></h1>
        <p class="lide">
          Isto não é o site — é o <strong>bastidor</strong> dele. O modelo de site
          institucional que este template gera está em
          <a href="./index.html">./index.html</a>; aqui você vê, página por página, as
          capacidades da plataforma web que o tornam possível: sem build, sem
          framework, sem dependências, hospedado de graça no GitHub Pages.
        </p>
        <div class="linha-selos">
          <span class="selo selo-ok">Zero build</span>
          <span class="selo selo-ok">Zero dependências</span>
          <span class="selo selo-ok">Hospedagem gratuita</span>
          <span class="selo selo-ok">PWA instalável</span>
        </div>
        <div class="grupo-botoes">
          <a class="botao botao-primario" href="./index.html">Ver o site institucional</a>
        </div>
      </section>

      <div class="grade-cards">
        <demo-card href="#/roteamento">
          <span slot="icone">🧭</span>
          <span slot="titulo">Roteamento SPA</span>
          Navegação instantânea entre páginas, sem recarregar o documento — com
          hash routing e View Transitions.
        </demo-card>
        <demo-card href="#/tema">
          <span slot="icone">🌗</span>
          <span slot="titulo">Tema claro/escuro</span>
          Design tokens com CSS custom properties, preferência do sistema e
          escolha persistida — sem flash de tema errado.
        </demo-card>
        <demo-card href="#/componentes">
          <span slot="icone">🧩</span>
          <span slot="titulo">Web Components</span>
          Componentes reutilizáveis com shadow DOM e slots, direto do navegador —
          este card é um deles.
        </demo-card>
        <demo-card href="#/canvas">
          <span slot="icone">🎨</span>
          <span slot="titulo">Canvas</span>
          Um campo de partículas interativo a 60 qps, desenhado com a API
          Canvas 2D e requestAnimationFrame.
        </demo-card>
        <demo-card href="#/api">
          <span slot="icone">🔌</span>
          <span slot="titulo">Dados ao vivo</span>
          O site consome a API do GitHub e mostra estatísticas do próprio
          repositório — sem nenhum backend.
        </demo-card>
        <demo-card href="#/notas">
          <span slot="icone">📝</span>
          <span slot="titulo">Persistência local</span>
          Um mini-app de notas com localStorage que sobrevive ao reload e
          sincroniza entre abas.
        </demo-card>
        <demo-card href="#/offline">
          <span slot="icone">📴</span>
          <span slot="titulo">Offline e instalável</span>
          Manifesto + service worker: o site funciona sem internet e pode ser
          instalado como aplicativo.
        </demo-card>
        <demo-card href="#/sobre">
          <span slot="icone">ℹ️</span>
          <span slot="titulo">Como foi feito</span>
          A filosofia do projeto, o que ficou de fora de propósito e como
          publicar o seu igual.
        </demo-card>
      </div>

      <section>
        <h2>O deploy é um git push</h2>
        <p>
          Não há pipeline de build: o repositório <em>é</em> o site. Cada merge na branch
          principal aciona a publicação automática do GitHub Pages e, em cerca de um
          minuto, a nova versão está no ar — servida por CDN, com HTTPS e, quando
          quisermos, com domínio próprio configurado por um arquivo de uma linha.
        </p>
        <p>
          A responsividade que você vê aqui (grade fluida, tipografia com
          <code>clamp()</code>, navegação que se adapta) também não usa nada além de CSS.
        </p>
      </section>
    </div>
  `;
}
