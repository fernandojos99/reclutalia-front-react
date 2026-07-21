/** Derivación de fase/sub-paso de la vacante y helper de "candidato elegido" (portados de App.jsx). */
import { PIPE_IDX } from "../constants/catalogos";
import type { Vacante } from "../types/models/domain";

export interface FaseInfo {
  fase: number;
  subpaso: number;
  completados: boolean[];
}

export function faseVacante(v: Vacante): FaseInfo {
  const ps = Object.values(v.pipeline || {});
  const mx = ps.length ? Math.max(...ps.map((p) => PIPE_IDX[p.estado] ?? -1)) : -1;
  const aprobada = v.estado === "abierta" || v.estado === "cerrada";
  const completados = [
    aprobada,
    aprobada && ps.length > 0,
    mx >= PIPE_IDX.evaluado,
    mx >= PIPE_IDX.entrevistado,
    mx >= PIPE_IDX.docs_completos,
    mx >= PIPE_IDX.oferta_enviada,
    v.estado === "cerrada" || mx >= PIPE_IDX.contratado,
  ];
  let subpaso = completados.findIndex((x) => !x);
  if (subpaso < 0) subpaso = completados.length - 1;
  const fase = subpaso < 2 ? 1 : subpaso < 5 ? 2 : 3;
  return { fase, subpaso, completados };
}

/** ¿La vacante ya tiene candidato elegido? (derivado del pipeline). */
export const candidatoElegido = (v: Vacante): boolean =>
  v.estado !== "cerrada" &&
  Object.values(v.pipeline || {}).some((p) =>
    ["seleccionado", "docs_completos", "oferta_enviada", "oferta_aceptada"].includes(p.estado),
  );
