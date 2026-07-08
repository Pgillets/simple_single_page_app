/*
 * Página #/notas — persistência local com localStorage.
 *
 * Duas lições didáticas centrais:
 *   1. localStorage sobrevive a reload e é síncrono, então cada mudança é
 *      salva imediatamente — não existe "botão salvar";
 *   2. o evento "storage" dispara em OUTRAS abas da mesma origem quando o
 *      localStorage muda — abrir duas abas desta página mostra a sincronia
 *      ao vivo. E, texto vindo do usuário é sempre inserido com
 *      textContent, nunca innerHTML: é a defesa contra XSS armazenado.
 */

const CHAVE = "notas";

function lerNotas() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return bruto ? JSON.parse(bruto) : [];
  } catch {
    return [];
  }
}

function gravarNotas(notas) {
  localStorage.setItem(CHAVE, JSON.stringify(notas));
}

export const titulo = "Notas";

export function render(outlet) {
  outlet.innerHTML = `
    <div class="pagina">
      <h1>Uma lista de notas que não esquece</h1>
      <p class="lide">
        Sem servidor, sem banco de dados: só <code>localStorage</code>. Adicione uma
        nota, recarregue a página e ela continua aqui.
      </p>

      <div class="bloco-demo">
        <form class="form-nota" id="form-nota">
          <label for="campo-nota" class="visualmente-oculto">Nova nota</label>
          <input id="campo-nota" type="text" placeholder="Escreva algo e aperte Enter…" maxlength="140" autocomplete="off">
          <button type="submit" class="botao botao-primario">Adicionar</button>
        </form>
        <ul class="lista-notas" id="lista-notas"></ul>
      </div>

      <section>
        <h2>Experimente a sincronização entre abas</h2>
        <p>
          Abra esta mesma página em outra aba. Marque uma nota como concluída aqui —
          ela muda de estado <strong>na outra aba também</strong>, sem recarregar. Isso é
          o evento <code>storage</code>, disparado pelo navegador sempre que o
          <code>localStorage</code> é alterado em outra aba da mesma origem.
        </p>
        <p>
          Tente digitar <code>&lt;b&gt;teste&lt;/b&gt;</code> como nota: o texto aparece
          literalmente, sem virar negrito. A lista sempre insere o conteúdo com
          <code>textContent</code>, nunca <code>innerHTML</code> — a defesa básica
          contra XSS armazenado.
        </p>
      </section>

      <trecho-codigo arquivo="./js/paginas/notas.js"></trecho-codigo>
    </div>
  `;

  const lista = outlet.querySelector("#lista-notas");
  const formulario = outlet.querySelector("#form-nota");
  const campo = outlet.querySelector("#campo-nota");

  function desenhar() {
    const notas = lerNotas();
    lista.innerHTML = "";

    if (notas.length === 0) {
      const vazio = document.createElement("li");
      vazio.className = "vazio";
      vazio.textContent = "Nenhuma nota ainda.";
      lista.append(vazio);
      return;
    }

    for (const nota of notas) {
      const item = document.createElement("li");
      if (nota.feita) item.classList.add("feita");

      const marcador = document.createElement("input");
      marcador.type = "checkbox";
      marcador.checked = nota.feita;
      marcador.setAttribute("aria-label", `Marcar "${nota.texto}" como concluída`);
      marcador.addEventListener("change", () => alternarFeita(nota.id));

      const texto = document.createElement("span");
      texto.className = "texto-nota";
      texto.textContent = nota.texto; // nunca innerHTML — ver nota acima

      const apagar = document.createElement("button");
      apagar.type = "button";
      apagar.className = "apagar-nota";
      apagar.textContent = "✕";
      apagar.setAttribute("aria-label", `Apagar "${nota.texto}"`);
      apagar.addEventListener("click", () => apagarNota(nota.id));

      item.append(marcador, texto, apagar);
      lista.append(item);
    }
  }

  function adicionarNota(texto) {
    const notas = lerNotas();
    notas.unshift({ id: crypto.randomUUID(), texto, feita: false });
    gravarNotas(notas);
    desenhar();
  }

  function alternarFeita(id) {
    const notas = lerNotas().map((n) => (n.id === id ? { ...n, feita: !n.feita } : n));
    gravarNotas(notas);
    desenhar();
  }

  function apagarNota(id) {
    gravarNotas(lerNotas().filter((n) => n.id !== id));
    desenhar();
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const texto = campo.value.trim();
    if (!texto) return;
    adicionarNota(texto);
    campo.value = "";
    campo.focus();
  });

  function aoMudarStorage(evento) {
    if (evento.key === CHAVE || evento.key === null) desenhar();
  }
  addEventListener("storage", aoMudarStorage);

  desenhar();

  return () => removeEventListener("storage", aoMudarStorage);
}
