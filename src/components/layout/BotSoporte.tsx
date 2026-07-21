/**
 * Bot flotante de Reclutalia. Dos modos:
 *   - "FAQ": las preguntas frecuentes de siempre (respuestas locales, sin costo).
 *   - "Agente": chat en vivo con el agente IA del backend (DeepSeek) vía SSE. El agente
 *     usa tools que consumen los servicios del backend según el perfil (admin/formador/candidato).
 *
 * El panel es redimensionable (arrastrando borde izquierdo, superior y esquina sup-izquierda) y
 * las respuestas del bot se renderizan como Markdown.
 */
import { useCallback, useRef, useState } from "react";
import { Bot, X, Send, Sparkles, Wrench } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDemo } from "../../contexts/DemoContext";
import { enviarMensaje, getSessionId, type AgenteEvent } from "../../services/agenteService";

const BOT_FAQ = [
  { q: "¿Qué es el pool de talento?", a: "Es el marketplace de candidatos internos y externos preregistrados. Al aprobar tu vacante, la IA busca, filtra y ranquea automáticamente los perfiles más compatibles." },
  { q: "¿Cómo funciona el ranking con IA?", a: "El agente de IA compara especialidades, habilidades, nivel, experiencia y ubicación contra tu vacante y asigna un match de 0 a 100%. Se actualiza tras la video-entrevista y la entrevista contigo." },
  { q: "¿Qué documentos sube el candidato?", a: "Para filtros iniciales: constancias de empleos previos y el examen psicométrico (válido 6 meses). Para contratación: INE, CURP, RFC, comprobante de domicilio, comprobante de estudios y su cuenta bancaria para nómina. Solo PDF, máximo 1 MB por archivo." },
  { q: "¿Puedo cambiar la vacante que me asignaron?", a: "Sí. Antes de aprobarla puedes solicitar cambios al administrador desde la pestaña Descriptivo; recibirás una notificación cuando esté actualizada." },
  { q: "¿Cómo agendo entrevistas?", a: "Al invitar candidatos a entrevista conectas tu calendario de Outlook/Teams (simulado) y propones 3 horarios; el candidato confirma uno y ambos reciben el enlace de Teams." },
];

interface Mensaje { de: "bot" | "yo" | "tool"; t: string; }

type Modo = "faq" | "agente";
type Dir = "left" | "top" | "corner";

const MIN_W = 300, MIN_H = 340;

export function BotSoporte() {
  const { rol, formadorId, candId } = useDemo();
  const [open, setOpen] = useState(false);
  const [modo, setModo] = useState<Modo>("faq");
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Redimensionado del panel ──
  const [size, setSize] = useState({ w: 360, h: 520 });
  const dragRef = useRef<{ dir: Dir; x: number; y: number; w: number; h: number } | null>(null);

  const onResizeMove = useCallback((e: PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const maxW = window.innerWidth - 44;
    const maxH = window.innerHeight - 108;
    let w = d.w, h = d.h;
    if (d.dir === "left" || d.dir === "corner") w = d.w + (d.x - e.clientX);
    if (d.dir === "top" || d.dir === "corner") h = d.h + (d.y - e.clientY);
    setSize({
      w: Math.max(MIN_W, Math.min(maxW, w)),
      h: Math.max(MIN_H, Math.min(maxH, h)),
    });
  }, []);

  const onResizeEnd = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener("pointermove", onResizeMove);
    window.removeEventListener("pointerup", onResizeEnd);
    document.body.style.userSelect = "";
  }, [onResizeMove]);

  const onResizeStart = (dir: Dir) => (e: React.PointerEvent) => {
    e.preventDefault();
    dragRef.current = { dir, x: e.clientX, y: e.clientY, w: size.w, h: size.h };
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onResizeMove);
    window.addEventListener("pointerup", onResizeEnd);
  };

  const [faqMsgs, setFaqMsgs] = useState<Mensaje[]>([
    { de: "bot", t: "¡Hola! Soy tu asistente de Reclutalia. Elige una pregunta frecuente o cambia a 'Agente IA' para pedirme acciones sobre el sistema." },
  ]);
  const [chatMsgs, setChatMsgs] = useState<Mensaje[]>([
    { de: "bot", t: `Soy tu agente IA. Estás como **${rol}**. Puedo consultar y operar el sistema por ti: pídeme, por ejemplo, *"lista mis vacantes"* o *"muéstrame los candidatos del pool"*.` },
  ]);

  const scrollBottom = () => queueMicrotask(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight));

  const askFaq = (f: { q: string; a: string }) => {
    setFaqMsgs((m) => [...m, { de: "yo", t: f.q }, { de: "bot", t: f.a }]);
    scrollBottom();
  };

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || cargando) return;
    setInput("");
    setChatMsgs((m) => [...m, { de: "yo", t: texto }]);
    setCargando(true);
    scrollBottom();

    // Índice del mensaje del bot que iremos rellenando con la respuesta en streaming.
    let botIdx = -1;
    const ensureBot = (fragmento: string) =>
      setChatMsgs((m) => {
        if (botIdx === -1) { botIdx = m.length; return [...m, { de: "bot", t: fragmento }]; }
        const copia = [...m]; copia[botIdx] = { de: "bot", t: (copia[botIdx]?.t ?? "") + fragmento }; return copia;
      });

    const onEvent = (e: AgenteEvent) => {
      if (e.type === "tool") setChatMsgs((m) => [...m, { de: "tool", t: `Consultando: ${e.name}` }]);
      else if (e.type === "token") ensureBot(e.text);
      else if (e.type === "error") setChatMsgs((m) => [...m, { de: "bot", t: `⚠️ ${e.text}` }]);
      scrollBottom();
    };

    try {
      await enviarMensaje(
        { sessionId: getSessionId(), mensaje: texto, rol, formadorId, candId },
        onEvent,
      );
    } catch (err) {
      setChatMsgs((m) => [...m, { de: "bot", t: `⚠️ ${(err as Error).message}` }]);
    } finally {
      setCargando(false);
      scrollBottom();
    }
  };

  const msgs = modo === "faq" ? faqMsgs : chatMsgs;

  return (
    <>
      {open && (
        <div className="botpanel" style={{ width: size.w, height: size.h, maxWidth: "calc(100vw - 44px)", maxHeight: "calc(100vh - 108px)" }}>
          {/* Handles de redimensionado (panel anclado abajo-derecha → crece hacia arriba/izquierda) */}
          <div onPointerDown={onResizeStart("top")} style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, cursor: "ns-resize", zIndex: 3 }} />
          <div onPointerDown={onResizeStart("left")} style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 6, cursor: "ew-resize", zIndex: 3 }} />
          <div onPointerDown={onResizeStart("corner")} title="Arrastra para redimensionar" style={{ position: "absolute", top: 0, left: 0, width: 15, height: 15, cursor: "nwse-resize", zIndex: 4 }} />

          <div style={{ background: "var(--ink)", color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", gap: 9 }}>
            <Bot size={18} color="var(--gold)" />
            <b style={{ fontSize: 13.5 }}>Asistente Reclutalia</b>
            <span className="chip ai" style={{ marginLeft: "auto" }}>{modo === "faq" ? "FAQ" : "Agente IA"}</span>
          </div>

          {/* Selector de modo */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--line)" }}>
            <button className="btn ghost sm" style={{ flex: 1, borderRadius: 0, fontWeight: modo === "faq" ? 700 : 400 }} onClick={() => setModo("faq")}>Preguntas</button>
            <button className="btn ghost sm" style={{ flex: 1, borderRadius: 0, fontWeight: modo === "agente" ? 700 : 400, display: "flex", gap: 5, alignItems: "center", justifyContent: "center" }} onClick={() => setModo("agente")}>
              <Sparkles size={13} /> Agente IA
            </button>
          </div>

          <div ref={scrollRef} style={{ padding: 14, overflow: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.de === "yo" ? "flex-end" : "flex-start",
                background: m.de === "tool" ? "transparent" : m.de === "bot" ? "var(--bg)" : "var(--gold-soft)",
                border: m.de === "tool" ? "none" : "1px solid var(--line)",
                color: m.de === "tool" ? "var(--muted)" : "inherit",
                borderRadius: 12, padding: m.de === "tool" ? "2px 4px" : "8px 12px",
                fontSize: m.de === "tool" ? 11 : 12.5, maxWidth: "92%",
                display: m.de === "tool" ? "flex" : "block", alignItems: "center", gap: 5,
              }}>
                {m.de === "bot" ? (
                  <div className="chat-md"><ReactMarkdown remarkPlugins={[remarkGfm]}>{m.t}</ReactMarkdown></div>
                ) : m.de === "tool" ? (
                  <><Wrench size={11} />{m.t}</>
                ) : (
                  <span style={{ whiteSpace: "pre-wrap" }}>{m.t}</span>
                )}
              </div>
            ))}
            {cargando && <div style={{ alignSelf: "flex-start", color: "var(--muted)", fontSize: 11 }}>El agente está pensando…</div>}
          </div>

          {modo === "faq" ? (
            <div style={{ padding: 12, borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 6 }}>
              {BOT_FAQ.map((f, i) => (
                <button key={i} className="btn ghost sm" style={{ justifyContent: "flex-start", textAlign: "left" }} onClick={() => askFaq(f)}>
                  {f.q}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ padding: 12, borderTop: "1px solid var(--line)", display: "flex", gap: 6 }}>
              <input
                style={{ flex: 1, fontSize: 12.5, padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "var(--r-2)", background: "var(--input-bg)", color: "var(--ink)", outline: "none" }}
                placeholder="Escribe tu instrucción…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") enviar(); }}
                disabled={cargando}
              />
              <button className="btn sm" onClick={enviar} disabled={cargando || !input.trim()} title="Enviar">
                <Send size={15} />
              </button>
            </div>
          )}
        </div>
      )}
      <button className="botfab" onClick={() => setOpen((o) => !o)} title="Bot interactivo de apoyo y soporte">
        {open ? <X size={22} /> : <Bot size={24} />}
      </button>
    </>
  );
}
