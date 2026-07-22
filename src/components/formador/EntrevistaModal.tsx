/** Modal de entrevista con copiloto de IA / registro externo + evaluación con emoji (portado). */
import { useState } from "react";
import { Video, Sparkles, MessageSquare, CheckCircle2, FileSignature, Mic, Loader2 } from "lucide-react";
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

/** Evaluación de la entrevista como emoji: 👎 negativa · 😐 regular · 👍 positiva (guardada como 1/3/5). */
export const EVAL_OPCIONES: { val: number; emoji: string; label: string }[] = [
  { val: 5, emoji: "👍", label: "Positiva" },
  { val: 3, emoji: "😐", label: "Regular" },
  { val: 1, emoji: "👎", label: "Negativa" },
];
export const evalEmoji = (n: number): string => (n >= 4 ? "👍" : n >= 2 ? "😐" : "👎");
export const evalLabel = (n: number): string => (n >= 4 ? "Positiva" : n >= 2 ? "Regular" : "Negativa");

/** Botón de micrófono que "dicta" (simulado, 2 s) y agrega texto de ejemplo al campo indicado. */
function MicBtn({ dictando, onDictar }: { dictando: boolean; onDictar: () => void }) {
  return (
    <button type="button" className="btn ghost sm" onClick={onDictar} disabled={dictando} title="Dictar por voz (o escribe manualmente)">
      {dictando ? <Loader2 size={13} className="spin" /> : <Mic size={13} />} {dictando ? "Escuchando…" : "Dictar"}
    </button>
  );
}

export function EntrevistaModal({ cand, v, p, externa, onSave, onClose }: Props) {
  const [fase, setFase] = useState<"vivo" | "resumen">(externa ? "resumen" : "vivo");
  const [resumen, setResumen] = useState("");
  const [feedback, setFeedback] = useState("");
  const [calif, setCalif] = useState(0);
  const [dictando, setDictando] = useState<"resumen" | "feedback" | null>(null);

  const dictar = (campo: "resumen" | "feedback", setter: (fn: (s: string) => string) => void) => {
    setDictando(campo);
    const ejemplo = campo === "resumen"
      ? `Se le preguntó por su experiencia como ${cand.puesto.toLowerCase()} y por su dominio de ${cand.hard.slice(0, 2).join(" y ") || "sus herramientas"}; respondió con ejemplos concretos y seguridad.`
      : `Perfil sólido y buena comunicación. Recomiendo avanzar; validar disponibilidad de ingreso y expectativa salarial.`;
    window.setTimeout(() => { setter((s) => (s ? s + " " : "") + ejemplo); setDictando(null); }, 2000);
  };

  const preguntasIA = [
    `Cuéntame de un logro concreto como ${cand.puesto.toLowerCase()} y cómo lo mediste.`,
    `¿Cómo aplicarías ${v.req.hardSkills[0] || "tus herramientas"} en los retos de este puesto?`,
    `Describe una situación donde demostraste ${(v.req.softSkills[0] || "comunicación efectiva").toLowerCase()}.`,
    `¿Qué te motiva de esta posición (${v.req.titulo}) y del esquema ${v.req.modalidad.toLowerCase()}?`,
    "¿Cuál es tu expectativa salarial y disponibilidad de ingreso?",
  ];
  const genResumen = () =>
    `La IA registró la sesión (${p.slotElegido || hoy()}). ${cand.nombre.split(" ")[0]} sustentó ${cand.exp} años de experiencia en ${cand.esp[0] || cand.area}, con dominio de ${cand.hard.slice(0, 2).join(" y ")}. Mostró fortaleza en ${cand.soft[0]?.toLowerCase() || "comunicación"} y respondió con ejemplos medibles. Expectativa salarial: ${money(Number(cand.salario ?? 0))}. Puntos a profundizar: alineación de horario y experiencia específica en ${v.req.espRequeridas[0] || v.req.area}.`;

  return (
    <Modal onClose={onClose} wide>
      {fase === "vivo" && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Video size={18} color="var(--ai)" /><h3>Entrevista en curso · {cand.nombre}</h3>
            <span className="chip ai" style={{ marginLeft: "auto" }}><Sparkles size={11} /> Copiloto de IA activo</span>
          </div>
          <div className="aibox">
            <div className="hd"><MessageSquare size={14} /> Preguntas sugeridas por la IA</div>
            {preguntasIA.map((q, i) => <div key={i} style={{ fontSize: 13, padding: "9px 0", borderBottom: "1px dashed #D5D8F2" }}>{i + 1}. {q}</div>)}
            <div className="help" style={{ marginTop: 8 }}>Basadas en el descriptivo y el perfil del candidato. Al finalizar, la IA generará el resumen de la sesión.</div>
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <label style={{ flex: 1, marginBottom: 0 }}>¿Qué se preguntó y cómo respondió el candidato?</label>
                <MicBtn dictando={dictando === "resumen"} onDictar={() => dictar("resumen", setResumen)} />
              </div>
              <textarea rows={4} style={{ marginTop: 6 }} value={resumen} onChange={(e) => setResumen(e.target.value)} placeholder="Resumen de la entrevista realizada fuera de la plataforma…" />
            </div>
          )}
          <div className="field">
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <label style={{ flex: 1, marginBottom: 0 }}>Tu feedback y comentarios hacia el candidato *</label>
              <MicBtn dictando={dictando === "feedback"} onDictar={() => dictar("feedback", setFeedback)} />
            </div>
            <textarea rows={3} style={{ marginTop: 6 }} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Fortalezas, áreas de oportunidad y tu recomendación…" />
            <div className="help">Recuerda: tu retroalimentación queda registrada en el expediente y alimenta el ranking final.</div>
          </div>
          <div className="field">
            <label>Evaluación de la entrevista *</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {EVAL_OPCIONES.map((o) => (
                <button key={o.val} type="button" title={o.label} onClick={() => setCalif(o.val)}
                  className={"eval-btn" + (calif === o.val ? " on" : "")}>
                  <span style={{ fontSize: 26, lineHeight: 1 }}>{o.emoji}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600 }}>{o.label}</span>
                </button>
              ))}
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

/** Convierte calificaciones legadas (escala 10) a la escala de 5. */
export const califa5 = (n: number): number => (n > 5 ? Math.round(n / 2) : n);

/** Popup de solo lectura: resumen, feedback, evaluación (emoji) y "grabación" de la entrevista. */
export function VerEntrevistaModal({ cand, p, onClose }: { cand: Candidato; p: PipelineEntry; onClose: () => void }) {
  const e = p.entrevista;
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
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 30, lineHeight: 1 }}>{evalEmoji(e.calificacion)}</span>
            <b style={{ fontSize: 14, color: "var(--gold-dark)" }}>Evaluación: {evalLabel(e.calificacion)}</b>
            <span className="help" style={{ marginLeft: "auto" }}>Entrevista del {e.fecha}{e.externa ? " · registrada externamente" : ""}</span>
          </div>
          <div className="aibox" style={{ marginBottom: 10 }}>
            <div className="hd"><Sparkles size={13} /> Resumen</div>
            <p style={{ fontSize: 13, lineHeight: 1.55 }}>{e.resumen}</p>
          </div>
          <label>Feedback</label>
          <p style={{ fontSize: 13, lineHeight: 1.55, marginTop: 4 }}>{e.feedback}</p>
        </>
      ) : (
        <p className="help">Sin registro de entrevista para este candidato.</p>
      )}
      <button className="btn ghost" style={{ marginTop: 14 }} onClick={onClose}>Cerrar</button>
    </Modal>
  );
}
