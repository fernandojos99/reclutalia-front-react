/**
 * Barra de progreso del candidato en 3 etapas conectadas (Postulación / Entrevista / Contratación),
 * palomeadas según avanza. NO refleja el flujo interno completo, solo su representación visual.
 * Mapa (por PIPE_IDX): Postulación ✓ al pasar la video-IA (≥4) · Entrevista ✓ al entrevistarse (≥6)
 * · Contratación ✓ al contratarse (=11).
 */
import { Check, XCircle } from "lucide-react";
import { PIPE_IDX } from "../../constants/catalogos";
import { Chip } from "./Chip";

const ETAPAS = ["Postulación", "Entrevista", "Contratación"];

export function MiniPipe({ estado }: { estado: string }) {
  const idx = PIPE_IDX[estado] ?? 0;
  if (idx < 0) return <Chip tone="bad" icon={XCircle}>No continúa en el proceso</Chip>;
  const completas = [idx >= 4, idx >= 6, idx >= 11];
  const activa = completas[0] ? (completas[1] ? 2 : 1) : 0;
  return (
    <div className="ftl">
      {ETAPAS.map((et, i) => {
        const done = completas[i];
        const now = !done && i === activa;
        return (
          <div key={et} className={"ftl-step" + (done ? " done" : "") + (now ? " now" : "")}>
            <div className="ftl-node">{done ? <Check size={14} /> : i + 1}</div>
            <div className="ftl-label">{et}</div>
          </div>
        );
      })}
    </div>
  );
}
