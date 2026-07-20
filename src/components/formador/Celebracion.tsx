/** Pantalla de celebración de contratación (portado del `Celebracion`). */
import { PartyPopper, MapPin, Download, Calendar } from "lucide-react";
import { mapsUrl } from "../../utils/format";
import { DIRECCION_CORP } from "../../constants/catalogos";
import type { Candidato, PipelineEntry, Vacante } from "../../types/models/domain";

interface Props {
  cand: Candidato;
  p: PipelineEntry;
  v: Vacante;
}

const colores = ["#FFB81C", "#FFC000", "#4338CA", "#1E7A3C", "#fff"];

export function Celebracion({ cand, p, v }: Props) {
  return (
    <div className="celebrate">
      {[...Array(26)].map((_, i) => (
        <span key={i} className="confetti" style={{ left: i * 3.9 + "%", background: colores[i % 5], animationDelay: i * 0.23 + "s", animationDuration: 2.6 + (i % 5) * 0.5 + "s" }} />
      ))}
      <PartyPopper size={44} color="var(--gold)" style={{ marginBottom: 12 }} />
      <h2 style={{ fontSize: 24, marginBottom: 6 }}>¡Nueva contratación! 🎉</h2>
      <p style={{ color: "#C9C9C9", marginBottom: 22 }}>El proceso de la vacante {v.id} concluyó con éxito.</p>
      <div style={{ display: "inline-block", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,184,28,0.4)", borderRadius: 14, padding: "18px 34px", marginBottom: 22 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>{cand.nombre}</div>
        <div style={{ color: "var(--gold)", fontWeight: 600, marginTop: 3 }}>{v.req.titulo}</div>
        <div style={{ fontSize: 12.5, color: "#C9C9C9", marginTop: 8 }}>No. de empleado</div>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "0.18em", color: "var(--gold)" }}>{p.numEmpleado}</div>
        <div style={{ fontSize: 12.5, color: "#C9C9C9", marginTop: 8 }}>Ingreso y firma: <b style={{ color: "#fff" }}>{p.oferta?.fecha}</b></div>
        <div style={{ fontSize: 12.5, color: "#C9C9C9", marginTop: 8 }}>Se presenta en:</div>
        <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, marginTop: 2, maxWidth: 320 }}>{p.oferta?.ubicacion || DIRECCION_CORP}</div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <a className="btn ghost sm" href={mapsUrl(p.oferta?.ubicacion)} target="_blank" rel="noreferrer" style={{ background: "transparent", color: "#fff", borderColor: "#555" }}><MapPin size={13} /> Ver en Google Maps</a>
        <button className="btn gold sm"><Download size={13} /> Kit de inducción al área</button>
        <button className="btn gold sm"><Download size={13} /> Guía de bienvenida (LMS)</button>
        <button className="btn ghost sm" style={{ background: "transparent", color: "#fff", borderColor: "#555" }}><Calendar size={13} /> Agenda del primer día</button>
      </div>
      <p style={{ fontSize: 11.5, color: "#9E9E9E", marginTop: 18 }}>Se generó automáticamente su número de empleado, correo corporativo y accesos lógicos (SAP · simulado).</p>
    </div>
  );
}
