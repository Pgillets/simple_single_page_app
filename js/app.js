/*
 * app.js — ponto de entrada da aplicação (ES Module nativo, sem build).
 *
 * O navegador resolve este grafo de imports sozinho: é o "bundler" que
 * já vem instalado em todo lugar.
 */

import { definirRotas, iniciarRoteador } from "./roteador.js";
import { iniciarTema } from "./tema.js";
import { registrarServiceWorker } from "./sw-registro.js";

// Web Components: importar já registra os elementos customizados.
import "./componentes/demo-card.js";
import "./componentes/trecho-codigo.js";
import "./componentes/selo-status.js";
import "./componentes/estrela-avaliacao.js";

// Vistas — uma por rota.
import * as inicio from "./paginas/inicio.js";
import * as roteamento from "./paginas/roteamento.js";
import * as tema from "./paginas/tema.js";
import * as componentes from "./paginas/componentes.js";
import * as canvas from "./paginas/canvas.js";
import * as api from "./paginas/api.js";
import * as notas from "./paginas/notas.js";
import * as offline from "./paginas/offline.js";
import * as sobre from "./paginas/sobre.js";
import * as naoEncontrada from "./paginas/nao-encontrada.js";

definirRotas(
  {
    "/": inicio,
    "/roteamento": roteamento,
    "/tema": tema,
    "/componentes": componentes,
    "/canvas": canvas,
    "/api": api,
    "/notas": notas,
    "/offline": offline,
    "/sobre": sobre,
  },
  naoEncontrada
);

iniciarTema(document.getElementById("alternar-tema"));
iniciarRoteador(document.getElementById("conteudo"));
registrarServiceWorker();
