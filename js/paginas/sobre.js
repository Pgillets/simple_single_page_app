/*
 * Página #/sobre — filosofia, decisões e como reproduzir.
 */

export const titulo = "Sobre";

export function render(outlet) {
  outlet.innerHTML = `
    <div class="pagina">
      <h1>Como este site foi feito</h1>
      <p class="lide">
        A tese: para uma enorme classe de sites — inclusive o site institucional de uma
        pequena ou média empresa — a plataforma web já entrega, de graça e sem
        toolchain, o que costumamos buscar em frameworks e bundlers.
      </p>
      <p>
        Este template é, na verdade, <strong>dois documentos</strong>:
        <code>index.html</code>, o site institucional de verdade — estático, focado em
        SEO, sem depender de JavaScript para existir — e <code>tecnologia.html</code>
        (esta página que você está lendo agora), os bastidores técnicos, onde cada
        capacidade é demonstrada e explicada. Um visitante do site nunca precisa saber
        que este segundo documento existe; um desenvolvedor que for adaptar o
        template, sim.
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
        <h2>Como o código está organizado</h2>
        <p>
          Duas metades: a <strong>casca</strong> na raiz do repositório
          (<code>index.html</code>, <code>tecnologia.html</code>, <code>css/</code>,
          <code>assets/</code>) e a <strong>aplicação</strong> dos bastidores dentro de
          <code>js/</code>. O <code>index.html</code> é HTML estático puro — sem
          roteador, sem recarregar nada porque não precisa. Já <code>tecnologia.html</code>
          (esta página) carrega <code>js/app.js</code>, que nunca mais recarrega depois
          disso; é o roteador quem troca o conteúdo daqui pra frente.
        </p>
        <pre><code>index.html          O site institucional de verdade: estático, focado em SEO,
                    sem dependência de JavaScript para existir. É a página
                    que um mecanismo de busca ou uma pessoa visitante vê.
tecnologia.html     Esta página: os bastidores técnicos, como SPA de
                    verdade (roteador por hash, PRECACHE, tudo).
404.html            Só entra em cena se alguém digitar um CAMINHO de servidor
                    inexistente (diferente de uma rota interna desconhecida
                    de tecnologia.html, tratada dentro da própria aplicação).
manifest.webmanifest, sw.js
                    O que torna as duas páginas instaláveis e funcionais offline.
robots.txt, sitemap.xml
                    Infraestrutura de SEO: o que os buscadores devem indexar.

css/
  tokens.css        Só variáveis: cores, espaçamento, fontes — o "sistema de
                    design" do site inteiro (as duas páginas compartilham).
  base.css          Reset, layout do documento, tipografia, acessibilidade.
  componentes.css   Estilos reutilizados por várias páginas (nav, cards,
                    botões, blocos de demonstração...).

js/
  app.js            O ÚNICO arquivo que tecnologia.html carrega como módulo.
                    Importa tudo o resto e liga as três peças do núcleo.
  app-site.js       O que index.html carrega: só tema + service worker +
                    realce da navegação por âncora — sem roteador, sem
                    Web Components. O site institucional não precisa deles.
  roteador.js, tema.js, tema-boot.js, sw-registro.js, github-api.js
                    O "núcleo": comportamento compartilhado por várias páginas.
  componentes/      Web Components reutilizáveis — tags HTML de verdade,
                    registradas uma vez quando app.js as importa (só em
                    tecnologia.html; o index.html não os usa).
  paginas/          Uma vista por rota de tecnologia.html. Todo arquivo aqui
                    segue o mesmo contrato: exporta titulo e render(outlet).</code></pre>

        <h3>O que acontece quando tecnologia.html carrega</h3>
        <ol>
          <li>O navegador busca <code>tecnologia.html</code>. Antes de qualquer CSS ou
              módulo, o <code>&lt;head&gt;</code> já carrega <code>js/tema-boot.js</code>
              como script clássico e bloqueante — ele aplica o tema salvo no
              <code>&lt;html&gt;</code> antes da primeira pintura, evitando o "flash" de
              tema errado.</li>
          <li>As três folhas de CSS carregam, nesta ordem:
              <code>tokens.css</code> → <code>base.css</code> → <code>componentes.css</code>.</li>
          <li><code>js/app.js</code> roda como módulo (<code>type="module"</code>) e
              importa tudo o resto: os Web Components (que se auto-registram ao
              serem importados) e todas as vistas de <code>js/paginas/</code>.</li>
          <li><code>app.js</code> chama, nesta ordem: <code>definirRotas(...)</code>
              (um mapa <em>caminho → vista</em>), <code>iniciarTema(...)</code> (liga o
              botão do cabeçalho), <code>iniciarRoteador(...)</code> (lê
              <code>location.hash</code> e renderiza a vista certa dentro de
              <code>&lt;main id="conteudo"&gt;</code>) e <code>registrarServiceWorker()</code>.</li>
          <li>A cada clique num link <code>#/algo</code>, só o conteúdo de
              <code>&lt;main&gt;</code> muda: o roteador chama a limpeza da vista
              anterior (se ela devolveu uma) e depois o <code>render()</code> da nova —
              veja os detalhes em <a href="#/roteamento">Rotas</a>.</li>
        </ol>
        <p>
          Já <code>index.html</code> é mais simples: <code>js/app-site.js</code> só liga o
          tema, o service worker e o destaque da navegação conforme a seção visível —
          nenhum roteador, nenhuma vista, porque o conteúdo já está todo no HTML.
        </p>

        <h3>Como adicionar uma página nova aos bastidores</h3>
        <p>É o mesmo receita que usamos para os exemplos técnicos deste template:</p>
        <ol>
          <li>Criar <code>js/paginas/minha-pagina.js</code> exportando
              <code>titulo</code> e <code>render(outlet)</code>.</li>
          <li>Importar esse módulo em <code>app.js</code> e adicionar uma entrada no
              mapa passado para <code>definirRotas(...)</code>.</li>
          <li>Adicionar o link <code>&lt;a href="#/minha-pagina"&gt;</code> na navegação
              do <code>tecnologia.html</code>.</li>
          <li>Se a página deve funcionar offline desde o primeiro carregamento,
              adicionar o caminho do novo arquivo à lista <code>PRECACHE</code> do
              <code>sw.js</code> e subir a constante <code>VERSAO</code> — é o que
              dispara a substituição do cache antigo (ver <a href="#/offline">Offline</a>).</li>
        </ol>
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
          O motivo de existirem dois documentos (<code>index.html</code> e
          <code>tecnologia.html</code>) é justamente esse limite: conteúdo renderizado
          no cliente atrás de <code>#/rota</code> não é indexado individualmente pelos
          buscadores. Para o site que precisa aparecer no Google — o institucional —
          isso é inaceitável, então ele é HTML estático desde a origem. Para os
          bastidores técnicos, onde ninguém pesquisa "roteamento SPA site:este-site",
          isso não importa, e a SPA continua fazendo sentido.
        </p>
      </section>

      <section>
        <h2>Publique o seu igual</h2>
        <ol>
          <li>Faça um fork ou copie o repositório
              <a href="https://github.com/pgillets/simple_single_page_app">pgillets/simple_single_page_app</a>.</li>
          <li>Edite o <code>index.html</code>: troque nome, textos, serviços, contato e
              cores (<code>css/tokens.css</code>) pelos da sua empresa. É HTML puro —
              não precisa entender o resto do repositório para isso.</li>
          <li>Atualize <code>robots.txt</code>, <code>sitemap.xml</code> e as meta tags
              (título, descrição, JSON-LD) do <code>index.html</code> com o domínio final.</li>
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
