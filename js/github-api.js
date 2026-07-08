/*
 * github-api.js — dados dinâmicos num site estático, sem backend.
 *
 * A API pública do GitHub limita requisições anônimas a 60 por hora por IP.
 * Três defesas, todas didáticas:
 *   1. cache em localStorage com validade de 1 hora;
 *   2. requisições condicionais com ETag (If-None-Match): a resposta 304
 *      NÃO conta no rate limit;
 *   3. degradação graciosa — com erro ou limite estourado, mostramos o
 *      último dado bom que tivermos, com a hora em que foi obtido.
 */

export const REPO = "pgillets/simple_single_page_app";

const TTL_MS = 60 * 60 * 1000; // 1 hora

export function buscarDadosDoRepo(sinal) {
  return buscarComCache(`https://api.github.com/repos/${REPO}`, sinal);
}

export function buscarCommitsRecentes(sinal) {
  return buscarComCache(`https://api.github.com/repos/${REPO}/commits?per_page=5`, sinal);
}

async function buscarComCache(url, sinal) {
  const chave = `cache-api:${url}`;
  const guardado = lerCache(chave);

  // Cache fresco: nem toca na rede.
  if (guardado && Date.now() - guardado.quando < TTL_MS) {
    return { dados: guardado.dados, deCache: true, quando: guardado.quando };
  }

  const cabecalhos = { Accept: "application/vnd.github+json" };
  if (guardado?.etag) cabecalhos["If-None-Match"] = guardado.etag;

  try {
    const resposta = await fetch(url, { headers: cabecalhos, signal: sinal });

    if (resposta.status === 304 && guardado) {
      // Nada mudou no servidor — renova a validade do cache de graça.
      gravarCache(chave, { ...guardado, quando: Date.now() });
      return { dados: guardado.dados, deCache: true, quando: Date.now() };
    }

    if (!resposta.ok) {
      const limite = resposta.headers.get("X-RateLimit-Remaining") === "0";
      throw new Error(limite ? "rate-limit" : `HTTP ${resposta.status}`);
    }

    const dados = await resposta.json();
    gravarCache(chave, { dados, etag: resposta.headers.get("ETag"), quando: Date.now() });
    return { dados, deCache: false, quando: Date.now() };
  } catch (erro) {
    if (erro.name === "AbortError") throw erro;
    // Qualquer falha: serve o último dado bom, se existir.
    if (guardado) {
      return { dados: guardado.dados, deCache: true, quando: guardado.quando, erro };
    }
    throw erro;
  }
}

function lerCache(chave) {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

function gravarCache(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* armazenamento cheio ou bloqueado: segue sem cache */
  }
}

/* ===== Formatação (Intl: mais uma API nativa que dispensa biblioteca) ===== */

const numeroCompacto = new Intl.NumberFormat("pt-BR", { notation: "compact" });
const dataHora = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });
const relativo = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

export function formatarNumero(n) {
  return numeroCompacto.format(n);
}

export function formatarDataHora(timestamp) {
  return dataHora.format(new Date(timestamp));
}

export function formatarRelativo(iso) {
  const segundos = (new Date(iso).getTime() - Date.now()) / 1000;
  const unidades = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];
  for (const [unidade, tamanho] of unidades) {
    if (Math.abs(segundos) >= tamanho || unidade === "minute") {
      return relativo.format(Math.round(segundos / tamanho), unidade);
    }
  }
  return relativo.format(0, "minute");
}
