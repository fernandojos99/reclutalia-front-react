/** Bot flotante de FAQ (transversal), portado del `BotSoporte` original. */
import { useState } from "react";
import { Bot, X } from "lucide-react";

const BOT_FAQ = [
  { q: "¿Qué es el pool de talento?", a: "Es el marketplace de candidatos internos y externos preregistrados. Al aprobar tu vacante, la IA busca, filtra y ranquea automáticamente los perfiles más compatibles." },
  { q: "¿Cómo funciona el ranking con IA?", a: "El agente de IA compara especialidades, habilidades, nivel, experiencia y ubicación contra tu vacante y asigna un match de 0 a 100%. Se actualiza tras la video-entrevista y la entrevista contigo." },
  { q: "¿Qué documentos sube el candidato?", a: "Para filtros iniciales: constancias de empleos previos y el examen psicométrico (válido 6 meses). Para contratación: INE, CURP, RFC, comprobante de domicilio, comprobante de estudios y su cuenta bancaria para nómina. Solo PDF, máximo 1 MB por archivo." },
  { q: "¿Puedo cambiar la vacante que me asignaron?", a: "Sí. Antes de aprobarla puedes solicitar cambios al administrador desde la pestaña Descriptivo; recibirás una notificación cuando esté actualizada." },
  { q: "¿Cómo agendo entrevistas?", a: "Al invitar candidatos a entrevista conectas tu calendario de Outlook/Teams (simulado) y propones 3 horarios; el candidato confirma uno y ambos reciben el enlace de Teams." },
];

interface Mensaje { de: "bot" | "yo"; t: string; }

export function BotSoporte() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Mensaje[]>([
    { de: "bot", t: "¡Hola! Soy tu asistente de Reclutalia. Estoy aquí durante todo el proceso para resolver dudas del formador y del candidato. Elige una pregunta frecuente:" },
  ]);
  const ask = (f: { q: string; a: string }) =>
    setMsgs((m) => [...m, { de: "yo", t: f.q }, { de: "bot", t: f.a }]);

  return (
    <>
      {open && (
        <div className="botpanel">
          <div style={{ background: "var(--ink)", color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", gap: 9 }}>
            <Bot size={18} color="var(--gold)" />
            <b style={{ fontSize: 13.5 }}>Asistente Reclutalia</b>
            <span className="chip ai" style={{ marginLeft: "auto" }}>Bot de apoyo</span>
          </div>
          <div style={{ padding: 14, overflow: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.de === "bot" ? "flex-start" : "flex-end",
                background: m.de === "bot" ? "var(--bg)" : "var(--gold-soft)",
                border: "1px solid var(--line)", borderRadius: 12, padding: "8px 12px", fontSize: 12.5, maxWidth: "85%",
              }}>{m.t}</div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 6 }}>
            {BOT_FAQ.map((f, i) => (
              <button key={i} className="btn ghost sm" style={{ justifyContent: "flex-start", textAlign: "left" }} onClick={() => ask(f)}>
                {f.q}
              </button>
            ))}
          </div>
        </div>
      )}
      <button className="botfab" onClick={() => setOpen((o) => !o)} title="Bot interactivo de apoyo y soporte">
        {open ? <X size={22} /> : <Bot size={24} />}
      </button>
    </>
  );
}
