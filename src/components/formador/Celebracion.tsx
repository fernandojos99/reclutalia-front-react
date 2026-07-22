/**
 * Cierre del formador (rediseño Batch 6): inducción con avance animado, métricas del proceso
 * en números grandes y calificación de experiencia (5 estrellas). Conserva el confetti como marco.
 */
import { useState } from "react";
import { PartyPopper, Star } from "lucide-react";
import { diasActiva } from "../../utils/format";
import { CapacitacionModulo } from "../common/CapacitacionModulo";
import type { Candidato, PipelineEntry, Vacante } from "../../types/models/domain";

interface Props {
  cand: Candidato;
  p: PipelineEntry;
  v: Vacante;
}

const colores = ["#FFB81C", "#FFC000", "#4338CA", "#1E7A3C", "#fff"];

export function Celebracion({ cand, p, v }: Props) {
  const [rating, setRating] = useState(0);
  const regresanAlPool = Object.values(v.pipeline || {}).filter((x) => x.estado === "descartado").length;
  const dias = Math.max(1, diasActiva(v));
  const metricas: [string, string][] = [
    [String(dias), "días de cobertura"],
    ["3", "decisiones del formador"],
    ["100%", "digital y trazado"],
    [String(regresanAlPool), "candidatos que regresan al Marketplace de talento"],
  ];

  return (
    <>
    <div className="celebrate">
      {[...Array(26)].map((_, i) => (
        <span key={i} className="confetti" style={{ left: i * 3.9 + "%", background: colores[i % 5], animationDelay: i * 0.23 + "s", animationDuration: 2.6 + (i % 5) * 0.5 + "s" }} />
      ))}
      <PartyPopper size={40} color="var(--gold)" style={{ marginBottom: 10 }} />
      <h2 style={{ fontSize: 23, marginBottom: 4 }}>¡Nueva contratación! 🎉</h2>
      <p style={{ color: "#C9C9C9", marginBottom: 20 }}>
        {cand.nombre} · {v.req.titulo} · nº {p.numEmpleado} · {p.numEmpleado}@elektra.com.mx
      </p>

      {/* Métricas del proceso */}
      <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "#C9C9C9", fontWeight: 700, marginBottom: 10 }}>PROCESO COMPLETADO</div>
      <div className="metric4">
        {metricas.map(([n, l]) => (
          <div key={l} className="metric4-item">
            <b>{n}</b>
            <span>{l}</span>
          </div>
        ))}
      </div>

      {/* Rating de experiencia */}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, marginBottom: 8 }}>Califica tu experiencia</div>
        {rating === 0 ? (
          <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
            {[...Array(5)].map((_, i) => (
              <button key={i} type="button" title={`${i + 1}/5`} onClick={() => setRating(i + 1)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, lineHeight: 0 }}>
                <Star size={30} color="var(--gold)" fill="none" />
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 8 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={30} color="var(--gold)" fill={i < rating ? "var(--gold)" : "none"} />
              ))}
            </div>
            <p style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600 }}>¡Gracias por tu retroalimentación! Nos ayuda a mejorar el proceso.</p>
          </div>
        )}
      </div>
    </div>
    {/* Inducción al puesto — sección separada, solo lectura (la completa el candidato en su vista). */}
    <CapacitacionModulo titulo="Inducción al puesto" completados={p.capacitacion ?? []} />
    </>
  );
}
