/*
 * Página #/sobre — filosofia, decisões e como reproduzir.
 */

export const titulo = "Sobre";

export function render(outlet) {
  outlet.innerHTML = `
    <div class="pagina">
      <h1>Como este site foi feito</h1>
      <p class="lide">
        A tese: para uma enorme classe de sites, a plataforma web já entrega — de
        graça e sem toolchain — o que costumamos buscar em frameworks e bundlers.
      </p>

      <section>
        <h2>A stack inteira</h2>
        <ul>
          <li><strong>Hospedagem</strong>: GitHub Pages, gratuita, com CDN e HTTPS.</li>
          <li><strong>Deploy</strong>: <code>git push</code>. Não existe etapa de build.</li>
          <li><strong>Módulos</strong>: ES Modules nativos — o navegador resolve o grafo
              de imports que um bundler resolveria.</li>
          <li><strong>Componentes</strong>: Web Components (custom elements, shadow DOM, slots).</li>
          <li><strong>Estado e dados</strong>: localStorage, <code>fetch</code> e a API
              pública do GitHub — nenhum backend próprio.</li>
          <li><strong>Offline</strong>: manifesto + service worker de ~60 linhas.</li>
          <li><strong>Qualidade</strong>: CI valida HTML e links a cada push; uma
              Content Security Policy estrita vale para o site inteiro.</li>
        </ul>
      </section>

      <section>
        <h2>O que ficou de fora — de propósito</h2>
        <p>
          Nada contra frameworks: em apps grandes, com equipes grandes, eles pagam o
          próprio custo. Aqui, cada dependência a menos é uma parte a menos para
          atualizar, auditar e ver quebrar. Também deixamos de fora, por honestidade:
          WebGL/WebGPU, Web Audio e notificações push — impressionam, mas pedem
          permissões e cuidados que não cabem num showcase didático.
        </p>
        <p>
          O maior limite real desta arquitetura é SEO de rotas internas: conteúdo
          renderizado no cliente atrás de <code>#/rota</code> não é indexado
          individualmente. Para um blog ou loja, gere HTML estático por página
          (a mesma hospedagem serve); para apps, dashboards e demos, isso raramente importa.
        </p>
      </section>

      <section>
        <h2>Publique o seu igual</h2>
        <ol>
          <li>Faça um fork ou copie o repositório
              <a href="https://github.com/pgillets/simple_single_page_app">pgillets/simple_single_page_app</a>.</li>
          <li>Em <em>Settings → Pages</em>, escolha <em>Deploy from a branch</em>,
              branch <code>main</code>, pasta <code>/ (root)</code>.</li>
          <li>Em ~1 minuto o site está no ar. Domínio próprio? O passo a passo de DNS e
              HTTPS está em
              <a href="https://github.com/pgillets/simple_single_page_app/blob/main/docs/DOMINIO.md"><code>docs/DOMINIO.md</code></a> —
              a ativação é um arquivo <code>CNAME</code> de uma linha.</li>
        </ol>
        <p>O README do repositório (bilíngue) documenta tudo em detalhe.</p>
      </section>

      <section>
        <h2>Licença</h2>
        <p>MIT — use, copie, adapte.</p>
      </section>
    </div>
  `;
}
