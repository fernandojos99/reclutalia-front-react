/**
 * Contactos con los que el usuario puede chatear (chat directo), derivados del estado de la app:
 *   - candidato → el formador de cada vacante donde YA pasó la video-entrevista con IA (estado ≥ evaluado).
 *   - formador  → cada candidato de sus vacantes que ya pasó la video-entrevista con IA (estado ≥ evaluado).
 *   - admin     → el formador de cada una de sus vacantes.
 * La conversación es por (vacante, par de participantes); la id es determinista (igual que en el backend).
 */
import { PIPE_IDX } from "../constants/catalogos";
import type { Candidato, Formador, Vacante } from "../types/models/domain";

export interface Contacto {
  convId: string;
  vacId: string;
  vacTitulo: string;
  otro: { tipo: string; id: string; nombre: string };
}

/** Umbral: haber pasado la video-entrevista con IA (estado "evaluado" o posterior). */
const UMBRAL = PIPE_IDX.evaluado;

/** Id determinista de la conversación (debe coincidir con convIdDe del backend). */
export function convIdDe(vacId: string, x: { tipo: string; id: string }, y: { tipo: string; id: string }): string {
  const [p1, p2] = [`${x.tipo}:${x.id}`, `${y.tipo}:${y.id}`].sort();
  return `dc_${vacId}_${p1}_${p2}`;
}

export function contactosChat(
  rol: string,
  miId: string,
  vacantes: Vacante[],
  candidatos: Candidato[],
  formadores: Formador[],
): Contacto[] {
  const nombreFormador = (fid: string) => formadores.find((f) => f.id === fid)?.nombre ?? fid;
  const nombreCandidato = (cid: number) => candidatos.find((c) => c.id === cid)?.nombre ?? `Candidato ${cid}`;
  const out: Contacto[] = [];

  if (rol === "candidato") {
    const cid = Number(miId);
    for (const v of vacantes) {
      const p = v.pipeline[cid];
      if (!p || (PIPE_IDX[p.estado] ?? -1) < UMBRAL) continue;
      const otro = { tipo: "formador", id: v.formadorId };
      out.push({
        convId: convIdDe(v.id, { tipo: "candidato", id: miId }, otro),
        vacId: v.id, vacTitulo: v.req.titulo,
        otro: { ...otro, nombre: nombreFormador(v.formadorId) },
      });
    }
  } else if (rol === "formador") {
    for (const v of vacantes) {
      if (v.formadorId !== miId) continue;
      for (const [cidStr, p] of Object.entries(v.pipeline)) {
        if ((PIPE_IDX[p.estado] ?? -1) < UMBRAL) continue;
        const cid = Number(cidStr);
        const otro = { tipo: "candidato", id: cidStr };
        out.push({
          convId: convIdDe(v.id, { tipo: "formador", id: miId }, otro),
          vacId: v.id, vacTitulo: v.req.titulo,
          otro: { ...otro, nombre: nombreCandidato(cid) },
        });
      }
    }
  } else if (rol === "admin") {
    for (const v of vacantes) {
      const otro = { tipo: "formador", id: v.formadorId };
      out.push({
        convId: convIdDe(v.id, { tipo: "admin", id: "A1" }, otro),
        vacId: v.id, vacTitulo: v.req.titulo,
        otro: { ...otro, nombre: nombreFormador(v.formadorId) },
      });
    }
  }

  return out;
}
