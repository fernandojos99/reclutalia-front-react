/** Helpers de pipeline del lado del cliente (portados de App.jsx). */
import type { Vacante } from "../types/models/domain";

/** ¿El horario `slot` ya fue confirmado por otro candidato de esta vacante? */
export const slotTomado = (v: Vacante, slot: string, cid: number): boolean =>
  Object.entries(v.pipeline).some(
    ([ocid, op]) =>
      Number(ocid) !== Number(cid) &&
      op.slotElegido === slot &&
      !["descartado", "filtrado"].includes(op.estado),
  );

/** Estados en los que el candidato ya NO participa activamente en el proceso. */
const ESTADOS_TERMINALES = ["descartado", "filtrado", "rechazado", "contratado"];

/** ¿El candidato tiene un proceso ACTIVO (no terminal) en otra vacante distinta a `vacIdActual`? */
export const procesoActivoEnOtra = (vacantes: Vacante[], cid: number, vacIdActual?: string): boolean =>
  vacantes.some((v) => {
    const p = v.pipeline[cid];
    return v.id !== vacIdActual && !!p && !ESTADOS_TERMINALES.includes(p.estado);
  });
