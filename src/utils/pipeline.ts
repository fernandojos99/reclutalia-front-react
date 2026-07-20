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
