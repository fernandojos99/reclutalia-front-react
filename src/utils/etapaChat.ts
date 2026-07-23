/**
 * Detecta la etapa/contexto del usuario en la VISTA DE CHAT integrada, para elegir los chips de
 * preguntas y avisar al agente. El chat solo existe para formador y candidato:
 *   - candidato → estado de su proceso más avanzado (cand_<estado>) / cand_sin / cand_cerrado / cand_contratado.
 *   - formador  → form_home (la vista de chat no está anclada a una vacante concreta).
 */
import { PIPE_IDX } from "../constants/catalogos";
import type { Vacante } from "../types/models/domain";

const TERMINALES = ["descartado", "filtrado", "rechazado"];

export interface Etapa {
  stageKey: string;
  label: string;
}

export function etapaChat(rol: string, vacantes: Vacante[], candId?: number): Etapa {
  if (rol === "candidato" && candId != null) {
    const procesos = vacantes.filter((v) => v.pipeline[candId]);
    if (!procesos.length) return { stageKey: "cand_sin", label: "Sin postulaciones activas" };

    const activos = procesos.filter((v) => {
      const e = v.pipeline[candId].estado;
      return e !== "contratado" && !TERMINALES.includes(e);
    });
    if (!activos.length) {
      const contratado = procesos.some((v) => v.pipeline[candId].estado === "contratado");
      return contratado
        ? { stageKey: "cand_contratado", label: "Contratado" }
        : { stageKey: "cand_cerrado", label: "Proceso cerrado" };
    }

    const mejor = activos.reduce((a, b) =>
      (PIPE_IDX[b.pipeline[candId].estado] ?? -1) > (PIPE_IDX[a.pipeline[candId].estado] ?? -1) ? b : a);
    const estado = mejor.pipeline[candId].estado;
    return { stageKey: `cand_${estado}`, label: `Tu proceso está en la etapa "${estado}"` };
  }

  if (rol === "formador") return { stageKey: "form_home", label: "Inicio / Mis vacantes" };
  return { stageKey: "default", label: "General" };
}
