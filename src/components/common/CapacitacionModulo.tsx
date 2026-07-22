/**
 * Módulo de capacitación / inducción: lista de videos con barra de avance animada y check.
 * Se usa tanto en el cierre del formador (`Celebracion`) como en la vista del candidato contratado.
 * Diseñado sobre fondo oscuro (celebrate).
 */
import { PlayCircle, CheckCircle2 } from "lucide-react";

const VIDEOS = ["Inducción al área", "Inducción al puesto", "Cultura y valores del grupo"];

export function CapacitacionModulo({ titulo = "Módulo de capacitación" }: { titulo?: string }) {
  return (
    <div style={{ maxWidth: 460, margin: "0 auto 22px", textAlign: "left" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "#C9C9C9", fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>{titulo}</div>
      {VIDEOS.map((t, i) => (
        <div key={t} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
          <PlayCircle size={17} color="var(--gold)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, color: "#fff", fontWeight: 600 }}>{t}</div>
            <div className="induc-bar"><i style={{ animationDelay: `${i * 0.9}s` }} /></div>
          </div>
          <CheckCircle2 size={15} className="induc-check" style={{ animationDelay: `${i * 0.9 + 2.2}s` }} />
        </div>
      ))}
    </div>
  );
}
