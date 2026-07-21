/** Modal de entrevista con copiloto de IA / registro externo + calificación (portado). */
import { useState } from "react";
import { Video, Sparkles, MessageSquare, CheckCircle2, Star, FileSignature, Mic, Loader2 } from "lucide-react";
import { Modal } from "../common/Modal";
import { money, hoy } from "../../utils/format";
import type { Candidato, PipelineEntry, Vacante } from "../../types/models/domain";

interface Payload { resumen: string; feedback: string; externa: boolean; calificacion: number; }

interface Props {
  cand: Candidato;
  v: Vacante;
  p: PipelineEntry;
  externa: boolean;
  onSave: (data: Payload) => void;
  onClose: () => void;
}

export function EntrevistaModal({ cand, v, p, externa, onSave, onClose }: Props) {
  const [fase, setFase] = useState<"vivo" | "resumen">(externa ? "resumen" : "vivo");
  const [notas, setNotas] = useState("");
  const [resumen, setResumen] = useState("");
  const [feedback, setFeedback] = useState("");
  const [calif, setCalif] = useState(0);
  const [dictando, setDictando] = useState(false);

  /** Simula dictado por voz: 2 s "escuchando…" y agrega notas de ejemplo. */
  const dictar = () => {
    setDictando(true);
    window.setTimeout(() => {
      const ejemplo = `El candidato respondió con seguridad; buen dominio de ${v.req.hardSkills[0] || "las herramientas"}. Confirmar expectativa salarial y fecha de ingreso.`;
      setNotas((n) => (n ? n + " " : "") + ejemplo);
      setDictando(false);
    }, 2000);
  };

  const preguntasIA = [
    `Cuéntame de un logro concreto como ${cand.puesto.toLowerCase()} y cómo lo mediste.`,
    `¿Cómo aplicarías ${v.req.hardSkills[0] || "tus herramientas"} en los retos de este puesto?`,
    `Describe una situación donde demostraste ${(v.req.softSkills[0] || "comunicación efectiva").toLowerCase()}.`,
    `¿Qué te motiva de esta posición (${v.req.titulo}) y del esquema ${v.req.modalidad.toLowerCase()}?`,
    "¿Cuál es tu expectativa salarial y disponibilidad de ingreso?",
  ];
  const genResumen = () =>
    `La IA registró la sesión (${p.slotElegido || hoy()}). ${cand.nombre.split(" ")[0]} sustentó ${cand.exp} años de experiencia en ${cand.esp[0] || cand.area}, con dominio de ${cand.hard.slice(0, 2).join(" y ")}. Mostró fortaleza en ${cand.soft[0]?.toLowerCase() || "comunicación"} y respondió con ejemplos medibles. Expectativa salarial: ${money(Number(cand.salario ?? 0))}. Puntos a profundizar: alineación de horario y experiencia específica en ${v.req.espRequeridas[0] || v.req.area}.` +
    (notas ? ` Notas del formador durante la sesión: ${notas}` : "");

  return (
    <Modal onClose={onClose} wide>
      {fase === "vivo" && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Video size={18} color="var(--ai)" /><h3>Entrevista en curso · {cand.nombre}</h3>
            <span className="chip ai" style={{ marginLeft: "auto" }}><Sparkles size={11} /> Copiloto de IA activo</span>
          </div>
          <div className="grid2">
            <div className="aibox">
              <div className="hd"><MessageSquare size={14} /> Preguntas sugeridas por la IA</div>
              {preguntasIA.map((q, i) => <div key={i} style={{ fontSize: 12.5, padding: "7px 0", borderBottom: "1px dashed #D5D8F2" }}>{i + 1}. {q}</div>)}
              <div className="help" style={{ marginTop: 8 }}>Basadas en el descriptivo y el perfil del candidato.</div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <label style={{ flex: 1, marginBottom: 0 }}>La IA resumirá la reunión, agrega tus propias notas aquí:</label>
                <button type="button" className="btn ghost sm" onClick={dictar} disabled={dictando}>
                  {dictando ? <Loader2 size={13} className="spin" /> : <Mic size={13} />} {dictando ? "Escuchando…" : "Grabar notas"}
                </button>
              </div>
              <textarea rows={9} style={{ marginTop: 6 }} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Observaciones durante la entrevista (opcional)…" />
            </div>
          </div>
          <button className="btn dark" style={{ marginTop: 14 }} onClick={() => { setResumen(genResumen()); setFase("resumen"); }}><CheckCircle2 size={15} /> Finalizar entrevista</button>
        </>
      )}
      {fase === "resumen" && (
        <>
          <h3 style={{ marginBottom: 12 }}>{externa ? "Registrar entrevista externa / presencial" : "Resumen generado por la IA"}</h3>
          {!externa && (
            <div className="aibox" style={{ marginBottom: 12 }}>
              <div className="hd"><Sparkles size={14} /> Resumen de la sesión + nuevo ranking (simulado)</div>
              <textarea rows={5} value={resumen} onChange={(e) => setResumen(e.target.value)} />
            </div>
          )}
          {externa && (
            <div className="field">
              <label>¿Qué se preguntó y cómo respondió el candidato?</label>
              <textarea rows={4} value={resumen} onChange={(e) => setResumen(e.target.value)} placeholder="Resumen de la entrevista realizada fuera de la plataforma…" />
            </div>
          )}
          <div className="field">
            <label>Tu feedback y comentarios hacia el candidato *</label>
            <textarea rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Fortalezas, áreas de oportunidad y tu recomendación…" />
            <div className="help">Recuerda: tu retroalimentación queda registrada en el expediente y alimenta el ranking final.</div>
          </div>
          <div className="field">
            <label>Calificación de la entrevista (1 a 5 estrellas) *</label>
            <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
              {[...Array(5)].map((_, i) => (
                <button key={i} type="button" title={`${i + 1}/5`} onClick={() => setCalif(i + 1)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 3, lineHeight: 0 }}>
                  <Star size={26} color={i < calif ? "var(--gold)" : "var(--line)"} fill={i < calif ? "var(--gold)" : "none"} />
                </button>
              ))}
              {calif > 0 && <b style={{ marginLeft: 8, fontSize: 13, color: "var(--gold-dark)" }}>{calif}/5</b>}
            </div>
            <div className="help">Solo visible para ti y el expediente interno; el candidato no la ve.</div>
          </div>
          <button className="btn gold" disabled={!feedback.trim() || calif < 1 || (externa && !resumen.trim())}
            onClick={() => onSave({ resumen, feedback, externa, calificacion: calif })}>
            <FileSignature size={15} /> Guardar entrevista y actualizar ranking
          </button>
        </>
      )}
    </Modal>
  );
}

/** Convierte calificaciones legadas (escala 10) a la escala de 5 estrellas. */
export const califa5 = (n: number): number => (n > 5 ? Math.round(n / 2) : n);

/** Popup de solo lectura: resumen, feedback, calificación y "grabación" de la entrevista. */
export function VerEntrevistaModal({ cand, p, onClose }: { cand: Candidato; p: PipelineEntry; onClose: () => void }) {
  const e = p.entrevista;
  const stars = e ? califa5(e.calificacion) : 0;
  return (
    <Modal onClose={onClose} wide>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingRight: 28 }}>
        <Video size={18} color="var(--ai)" /><h3>Entrevista · {cand.nombre}</h3>
      </div>
      <div style={{ background: "var(--ink)", borderRadius: 14, height: 150, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, marginBottom: 12, position: "relative" }}>
        <button className="btn ai sm"><Video size={13} /> Reproducir grabación (simulada)</button>
        <div style={{ position: "absolute", bottom: 10, left: 14, right: 14 }}>
          <div className="mini-pipe">{[...Array(10)].map((_, i) => <i key={i} className={i < 4 ? "f" : ""} style={i < 4 ? { background: "var(--ai)" } : { background: "#3A3A3A" }} />)}</div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#8A8A8A", fontSize: 10, marginTop: 4 }}><span>12:40</span><span>31:05</span></div>
        </div>
      </div>
      {e ? (
        <>
          <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 10 }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={20} color={i < stars ? "var(--gold)" : "var(--line)"} fill={i < stars ? "var(--gold)" : "none"} />)}
            <b style={{ marginLeft: 6, fontSize: 13, color: "var(--gold-dark)" }}>{stars}/5</b>
            <span className="help" style={{ marginLeft: 8 }}>Entrevista del {e.fecha}{e.externa ? " · registrada externamente" : ""}</span>
          </div>
          <div className="aibox" style={{ marginBottom: 10 }}>
            <div className="hd"><Sparkles size={13} /> Resumen</div>
            <p style={{ fontSize: 13, lineHeight: 1.55 }}>{e.resumen}</p>
          </div>
          <label>Feedback del formador</label>
          <p style={{ fontSize: 13, lineHeight: 1.55, marginTop: 4 }}>{e.feedback}</p>
        </>
      ) : (
        <p className="help">Sin registro de entrevista para este candidato.</p>
      )}
      <button className="btn ghost" style={{ marginTop: 14 }} onClick={onClose}>Cerrar</button>
    </Modal>
  );
}
