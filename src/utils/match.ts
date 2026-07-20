/**
 * Motor de match del lado del cliente — espejo determinístico del backend, para mostrar el % en
 * "Buscar vacantes" sin ida y vuelta al servidor. Debe dar EXACTAMENTE el mismo score que el backend.
 */
import { NIVELES } from "../constants/catalogos";
import type { Candidato, Requisito } from "../types/models/domain";

const KM: Record<string, Record<string, number>> = {
  CDMX: { CDMX: 0, Toluca: 65, Puebla: 130, Querétaro: 210, Guadalajara: 540, Monterrey: 900, León: 390, Mérida: 1300, Tijuana: 2800 },
  Monterrey: { Monterrey: 0, CDMX: 900, Querétaro: 700, Guadalajara: 770, León: 590, Toluca: 940, Puebla: 990, Mérida: 1900, Tijuana: 2300 },
  Guadalajara: { Guadalajara: 0, León: 220, CDMX: 540, Querétaro: 350, Toluca: 480, Monterrey: 770, Puebla: 660, Mérida: 1800, Tijuana: 2200 },
};
const distKm = (a: string, b: string): number => (KM[a] && KM[a][b] != null ? KM[a][b] : a === b ? 0 : 600);

export function matchScore(c: Candidato, req: Requisito): number {
  let s = 0;
  const inter = (a: string[], b: string[]) => a.filter((x) => b.includes(x)).length;
  const er = req.espRequeridas.length ? inter(c.esp, req.espRequeridas) / req.espRequeridas.length : 0.5;
  s += er * 34;
  if (req.espOpcionales.length) s += (inter(c.esp, req.espOpcionales) / req.espOpcionales.length) * 6;
  if (req.hardSkills.length) s += (inter(c.hard, req.hardSkills) / req.hardSkills.length) * 24;
  if (req.softSkills.length) s += (inter(c.soft, req.softSkills) / req.softSkills.length) * 8;
  const ni = NIVELES.indexOf(c.nivel as (typeof NIVELES)[number]);
  const nr = NIVELES.indexOf(req.nivelPuesto as (typeof NIVELES)[number]);
  s += ni === nr ? 12 : Math.abs(ni - nr) === 1 ? 7 : 1;
  s += c.exp >= req.anosExp ? 8 : (c.exp / Math.max(req.anosExp, 1)) * 5;
  const d = distKm(req.ubicacionCandidato, c.ciudad);
  s += req.ubicacionNoRelevante ? 7 : req.modalidad === "Remoto" || c.modalidad === "Remoto" ? 7 : d <= req.radioKm ? 7 : d <= req.radioKm * 4 ? 3 : 0;
  if (c.modalidad === req.modalidad || req.modalidad === "Remoto") s += 3;
  s += ((c.id * 37) % 7) - 3;
  return Math.max(0, Math.min(98, Math.round(s)));
}
