/**
 * Módulo de inducción / capacitación como SECCIÓN separada (tarjeta clara).
 * - Vista del candidato (`onVer` definido): cada módulo tiene un botón "Ver material" que al
 *   pulsarlo lo marca como completado. La completitud se persiste y la ve también el formador.
 * - Vista del formador (`onVer` ausente): solo lectura; los módulos se muestran "En proceso"
 *   hasta que el candidato los termina en su vista.
 */
import { GraduationCap, PlayCircle, CheckCircle2, Clock } from "lucide-react";

export const VIDEOS = ["Inducción al área", "Inducción al puesto", "Cultura y valores del grupo"];

interface Props {
  titulo?: string;
  /** Módulos ya completados por el candidato. */
  completados?: string[];
  /** Si se provee, se muestran botones "Ver material" (vista del candidato). */
  onVer?: (modulo: string) => void;
}

export function CapacitacionModulo({ titulo = "Inducción al puesto", completados = [], onVer }: Props) {
  const hechos = VIDEOS.filter((t) => completados.includes(t)).length;
  return (
    <div className="card" style={{ marginBottom: 16, textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <GraduationCap size={16} color="var(--gold-dark)" />
        <b style={{ fontSize: 14, flex: 1 }}>{titulo}</b>
        <span className="help">{hechos}/{VIDEOS.length} completado(s)</span>
      </div>
      {VIDEOS.map((t) => {
        const done = completados.includes(t);
        return (
          <div key={t} className={"check-item" + (done ? " done" : "")} style={{ marginBottom: 8 }}>
            {done ? <CheckCircle2 size={18} color="var(--ok)" /> : <PlayCircle size={18} color="var(--gray)" />}
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{t}</div>
            {done ? (
              <span className="chip ok"><CheckCircle2 size={11} /> Completado</span>
            ) : onVer ? (
              <button className="btn gold sm" onClick={() => onVer(t)}><PlayCircle size={13} /> Ver material</button>
            ) : (
              <span className="chip gold"><Clock size={11} /> En proceso</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
