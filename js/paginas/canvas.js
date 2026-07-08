/*
 * Página #/canvas — campo de partículas 2D interativo.
 *
 * Sem bibliotecas: Canvas 2D API + requestAnimationFrame. A limpeza (função
 * devolvida por render) cancela o loop de animação e remove os listeners de
 * ponteiro — essencial para não empilhar loops órfãos a cada visita à página.
 */

export const titulo = "Canvas";

export function render(outlet) {
  outlet.innerHTML = `
    <div class="pagina">
      <h1>Um campo de partículas, sem bibliotecas</h1>
      <p class="lide">
        Só a API Canvas 2D e <code>requestAnimationFrame</code>. Mova o ponteiro (ou o
        dedo) sobre o quadro:
      </p>

      <div class="bloco-demo bloco-canvas">
        <div class="hud">
          <span class="selo" id="selo-fps">-- qps</span>
          <span class="selo" id="selo-contagem">-- partículas</span>
        </div>
        <canvas id="tela" aria-label="Animação decorativa de partículas reagindo ao ponteiro" role="img"></canvas>
      </div>

      <section>
        <h2>Como funciona</h2>
        <p>
          Cada partícula é um objeto simples com posição e velocidade; a cada quadro,
          ela se move, sofre atrito e é repelida pelo ponteiro dentro de um raio fixo.
          Nada de física real — só o suficiente para parecer vivo.
        </p>
        <p>
          Quem prefere menos movimento na tela (<code>prefers-reduced-motion: reduce</code>)
          vê o quadro parado num único frame, sem o loop de animação rodando.
        </p>
      </section>

      <trecho-codigo arquivo="./js/paginas/canvas.js"></trecho-codigo>
    </div>
  `;

  const tela = outlet.querySelector("#tela");
  const ctx = tela.getContext("2d");
  const seloFps = outlet.querySelector("#selo-fps");
  const seloContagem = outlet.querySelector("#selo-contagem");

  const reduzirMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const RAIO_PONTEIRO = 110;
  const cor = getComputedStyle(document.documentElement).getPropertyValue("--cor-destaque").trim() || "#4f46e5";

  let largura = 0;
  let altura = 0;
  let particulas = [];
  const ponteiro = { x: -9999, y: -9999, ativo: false };

  function redimensionar() {
    const retangulo = tela.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    largura = retangulo.width;
    altura = retangulo.height;
    tela.width = Math.round(largura * dpr);
    tela.height = Math.round(altura * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const quantidade = Math.round((largura * altura) / 9000);
    particulas = Array.from({ length: quantidade }, criarParticula);
    seloContagem.textContent = `${quantidade} partículas`;
  }

  function criarParticula() {
    return {
      x: Math.random() * largura,
      y: Math.random() * altura,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      raio: 1.4 + Math.random() * 1.8,
    };
  }

  function passo() {
    ctx.clearRect(0, 0, largura, altura);
    ctx.fillStyle = cor;

    for (const p of particulas) {
      if (ponteiro.ativo) {
        const dx = p.x - ponteiro.x;
        const dy = p.y - ponteiro.y;
        const distancia = Math.hypot(dx, dy);
        if (distancia < RAIO_PONTEIRO && distancia > 0.01) {
          const forca = (1 - distancia / RAIO_PONTEIRO) * 0.6;
          p.vx += (dx / distancia) * forca;
          p.vy += (dy / distancia) * forca;
        }
      }

      p.vx *= 0.96;
      p.vy *= 0.96;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > largura) p.vx *= -1;
      if (p.y < 0 || p.y > altura) p.vy *= -1;
      p.x = Math.max(0, Math.min(largura, p.x));
      p.y = Math.max(0, Math.min(altura, p.y));

      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.raio, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  let quadro = null;
  let ultimoTempo = performance.now();
  let quadrosDesdeUltimaMedida = 0;
  let tempoUltimaMedida = ultimoTempo;

  function loop(agora) {
    passo();
    quadrosDesdeUltimaMedida++;
    if (agora - tempoUltimaMedida >= 500) {
      const qps = Math.round((quadrosDesdeUltimaMedida * 1000) / (agora - tempoUltimaMedida));
      seloFps.textContent = `${qps} qps`;
      quadrosDesdeUltimaMedida = 0;
      tempoUltimaMedida = agora;
    }
    quadro = requestAnimationFrame(loop);
  }

  function aoMoverPonteiro(evento) {
    const retangulo = tela.getBoundingClientRect();
    ponteiro.x = evento.clientX - retangulo.left;
    ponteiro.y = evento.clientY - retangulo.top;
    ponteiro.ativo = true;
  }

  function aoSairPonteiro() {
    ponteiro.ativo = false;
  }

  redimensionar();
  const observadorRedimensionamento = new ResizeObserver(redimensionar);
  observadorRedimensionamento.observe(tela);

  tela.addEventListener("pointermove", aoMoverPonteiro);
  tela.addEventListener("pointerleave", aoSairPonteiro);

  if (reduzirMovimento) {
    passo();
    seloFps.textContent = "movimento reduzido";
  } else {
    quadro = requestAnimationFrame(loop);
  }

  return () => {
    if (quadro !== null) cancelAnimationFrame(quadro);
    observadorRedimensionamento.disconnect();
    tela.removeEventListener("pointermove", aoMoverPonteiro);
    tela.removeEventListener("pointerleave", aoSairPonteiro);
  };
}
