/** Grabación + resumen simulados de la video-entrevista con IA (portado del `VideoIAResumenModal`). */
import { Video, Sparkles, Bot, Download, User } from "lucide-react";
import { Modal } from "../common/Modal";
import type { Candidato, Vacante } from "../../types/models/domain";

interface Props {
  cand: Candidato;
  v: Vacante;
  onClose: () => void;
}

export function VideoIAResumenModal({ cand, v, onClose }: Props) {
  const nombre = cand.nombre.split(" ")[0];
  const preguntas = [
    { q: "Preséntate: trayectoria, especialidad y lo que buscas en tu siguiente reto.", a: `${nombre} resumió ${cand.exp} años en ${cand.esp[0] || cand.area}, con foco en ${cand.hard.slice(0, 2).join(" y ") || "sus herramientas"}. Busca un rol con crecimiento y mayor responsabilidad.` },
    { q: `Cuéntame un proyecto donde aplicaste ${v.req.hardSkills.slice(0, 2).join(" y ") || "tus herramientas"}.`, a: "Describió un caso concreto con resultados medibles y su rol específico dentro del equipo." },
    { q: `¿Cómo describirías tu nivel en ${v.req.espRequeridas[0] || v.req.area}?`, a: `Se ubicó en un nivel ${cand.nivel.toLowerCase()} y lo sustentó con un ejemplo de su experiencia.` },
    { q: "Describe una situación difícil con un cliente o compañero y cómo la resolviste.", a: `Mostró ${cand.soft[0]?.toLowerCase() || "comunicación efectiva"} y orientación a la solución.` },
    { q: "¿Por qué te interesa esta posición y qué disponibilidad tienes?", a: `Alineó su interés con la vacante "${v.req.titulo}" y confirmó disponibilidad para el esquema ${v.req.modalidad.toLowerCase()}.` },
  ];
  return (
    <Modal onClose={onClose} wide>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Video size={18} color="var(--ai)" /><h3>Entrevista con IA · {cand.nombre}</h3>
        <span className="chip ai" style={{ marginLeft: "auto" }}><Sparkles size={11} /> Primer filtro (simulado)</span>
      </div>
      <div style={{ background: "var(--ink)", borderRadius: 14, height: 180, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, marginBottom: 6, position: "relative" }}>
        <div style={{ width: 60, height: 60, borderRadius: 99, background: "var(--ai)", display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={30} color="#fff" /></div>
        <span style={{ color: "#C9C9C9", fontSize: 12 }}>Grabación de la video-entrevista · reproducción simulada</span>
        <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
          <div className="mini-pipe">{[...Array(10)].map((_, i) => <i key={i} className={i < 3 ? "f" : ""} style={i < 3 ? { background: "var(--ai)" } : { background: "#3A3A3A" }} />)}</div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#8A8A8A", fontSize: 10, marginTop: 4 }}><span>02:18</span><span>07:45</span></div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button className="btn ai sm"><Video size={13} /> Reproducir grabación</button>
        <button className="btn ghost sm"><Download size={13} /> Descargar (demo)</button>
      </div>
      <div className="aibox" style={{ marginBottom: 12 }}>
        <div className="hd"><Sparkles size={14} /> Resumen de la IA</div>
        <p style={{ fontSize: 13, lineHeight: 1.55 }}>{nombre} completó la video-entrevista automatizada como primer filtro. Sustentó {cand.exp} años de experiencia en {cand.esp[0] || cand.area} y dominio de {cand.hard.slice(0, 2).join(" y ") || "sus herramientas"}. Comunicación clara y respuestas con ejemplos concretos. Perfil alineado con "{v.req.titulo}"; se recomienda avanzar a revisión para terna.</p>
      </div>
      <label>Transcripción de la sesión (extracto)</label>
      <div style={{ maxHeight: 230, overflowY: "auto", marginTop: 6 }}>
        {preguntas.map((pg, i) => (
          <div key={i} className="trow" style={{ alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ai)" }}><Bot size={12} style={{ verticalAlign: -1 }} /> IA: {pg.q}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink2)", marginTop: 4 }}><User size={12} style={{ verticalAlign: -1 }} /> {nombre}: {pg.a}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="help" style={{ marginTop: 10 }}>Grabación, transcripción y resumen simulados para ilustrar el primer filtro con IA en este prototipo.</div>
      <button className="btn ghost" style={{ marginTop: 12 }} onClick={onClose}>Cerrar</button>
    </Modal>
  );
}
