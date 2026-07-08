/*
 * Página #/offline — PWA: manifesto, service worker e instalação.
 */

import { obterEventoDeInstalacao, limparEventoDeInstalacao, desligarServiceWorker } from "../sw-registro.js";

export const titulo = "Offline";

export function render(outlet) {
  const suportaSw = "serviceWorker" in navigator;

  outlet.innerHTML = `
    <div class="pagina">
      <h1>Funciona sem internet — e se instala</h1>
      <p class="lide">
        Um <code>manifest.webmanifest</code> e um service worker de menos de 100 linhas
        bastam para transformar este site num aplicativo instalável que funciona offline.
      </p>

      <section>
        <h2>Experimente agora</h2>
        <div class="chamada-caixa">
          Desligue o Wi-Fi (ou ative "Offline" nas ferramentas de desenvolvedor) e
          navegue pelo site: o cabeçalho, o rodapé e as páginas já visitadas continuam
          funcionando, servidos pelo cache do service worker.
        </div>
      </section>

      <section>
        <h2>Status neste navegador</h2>
        <ul class="lista-status" id="lista-status"></ul>
        <div class="grupo-botoes">
          <button type="button" class="botao botao-primario" id="botao-instalar" hidden>Instalar aplicativo</button>
          <button type="button" class="botao" id="botao-limpar">Desregistrar e limpar caches</button>
        </div>
      </section>

      <section>
        <h2>A estratégia de cache</h2>
        <p>
          O service worker usa <strong>network-first</strong>: toda navegação e todo
          arquivo do próprio site tentam a rede primeiro e só caem no cache se a rede
          falhar. Isso evita o problema clássico de "publiquei uma atualização e o
          site continua mostrando a versão antiga" — agravado aqui porque o GitHub
          Pages já manda os arquivos com cache de até 10 minutos.
        </p>
        <p>
          Quando uma nova versão do <code>sw.js</code> é publicada, um aviso aparece no
          canto da tela oferecendo atualizar na hora.
        </p>
      </section>

      <trecho-codigo arquivo="./sw.js"></trecho-codigo>
      <trecho-codigo arquivo="./manifest.webmanifest"></trecho-codigo>
    </div>
  `;

  const listaStatus = outlet.querySelector("#lista-status");
  const botaoInstalar = outlet.querySelector("#botao-instalar");
  const botaoLimpar = outlet.querySelector("#botao-limpar");

  function itemStatus(rotulo, ok, detalhe) {
    const li = document.createElement("li");
    const selo = document.createElement("span");
    selo.className = `selo ${ok ? "selo-ok" : "selo-aviso"}`;
    selo.textContent = ok ? "sim" : "não";
    const texto = document.createElement("span");
    texto.textContent = detalhe ? `${rotulo} — ${detalhe}` : rotulo;
    li.append(selo, texto);
    return li;
  }

  async function atualizarStatus() {
    listaStatus.innerHTML = "";
    listaStatus.append(itemStatus("Service worker suportado", suportaSw));

    if (suportaSw) {
      const registros = await navigator.serviceWorker.getRegistrations();
      listaStatus.append(itemStatus("Service worker ativo", registros.length > 0));

      if ("caches" in window) {
        const chaves = await caches.keys();
        listaStatus.append(
          itemStatus("Cache do app shell", chaves.length > 0, chaves.join(", ") || undefined)
        );
      }
    }

    listaStatus.append(itemStatus("Modo de exibição instalado", matchMedia("(display-mode: standalone)").matches));
    listaStatus.append(itemStatus("Navegador online agora", navigator.onLine));
  }

  const eventoInstalacao = obterEventoDeInstalacao();
  if (eventoInstalacao) {
    botaoInstalar.hidden = false;
  }
  botaoInstalar.addEventListener("click", async () => {
    const evento = obterEventoDeInstalacao();
    if (!evento) return;
    evento.prompt();
    await evento.userChoice;
    limparEventoDeInstalacao();
    botaoInstalar.hidden = true;
  });

  botaoLimpar.addEventListener("click", async () => {
    botaoLimpar.disabled = true;
    botaoLimpar.textContent = "Limpando…";
    await desligarServiceWorker();
    await atualizarStatus();
    botaoLimpar.disabled = false;
    botaoLimpar.textContent = "Desregistrar e limpar caches";
  });

  const aoMudarConexao = () => atualizarStatus();
  addEventListener("online", aoMudarConexao);
  addEventListener("offline", aoMudarConexao);

  atualizarStatus();

  return () => {
    removeEventListener("online", aoMudarConexao);
    removeEventListener("offline", aoMudarConexao);
  };
}
