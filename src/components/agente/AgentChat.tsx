/**
 * Chat del Agente IA REUTILIZABLE (misma lógica de streaming SSE que el bot flotante original).
 * Se usa tanto en el bot flotante (`variant="flotante"`) como en la vista integrada (`variant="panel"`).
 *
 * Es un componente "tonto" respecto a la sesión: recibe `sessionId` + `initial` (historial ya
 * cargado) y consume/streamea contra el backend. Para cambiar de sesión, el padre lo re-monta
 * con `key={sessionId}` (estado limpio). Al terminar un intercambio llama `onActividad`.
 */
import { useRef, useState } from "react";
import { Send, Wrench, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { enviarMensaje, type AgenteEvent, type Rol } from "../../services/agenteService";
import { descargarDemo } from "../../utils/descargarDemo";

/** Texto plano de los hijos de un nodo Markdown (para nombrar el archivo de descarga). */
function textoDe(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.filter((c) => typeof c === "string").join("");
  return "";
}

export interface Mensaje { de: "bot" | "yo" | "tool"; t: string; }

interface Props {
  sessionId: string;
  identidad: { rol: Rol; formadorId?: string; candId?: number };
  initial?: Mensaje[];
  /** Se llama al terminar un intercambio (para refrescar la lista de sesiones/títulos). */
  onActividad?: () => void;
}

export function AgentChat({ sessionId, identidad, initial, onActividad }: Props) {
  const [msgs, setMsgs] = useState<Mensaje[]>(initial ?? []);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const autosize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 110) + "px";
  };
  const scrollBottom = () => queueMicrotask(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight));

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || cargando) return;
    setInput("");
    queueMicrotask(autosize);
    setMsgs((m) => [...m, { de: "yo", t: texto }]);
    setCargando(true);
    scrollBottom();

    // Índice del mensaje del bot que iremos rellenando con la respuesta en streaming.
    let botIdx = -1;
    const ensureBot = (fragmento: string) =>
      setMsgs((m) => {
        if (botIdx === -1) { botIdx = m.length; return [...m, { de: "bot", t: fragmento }]; }
        const copia = [...m]; copia[botIdx] = { de: "bot", t: (copia[botIdx]?.t ?? "") + fragmento }; return copia;
      });

    const onEvent = (e: AgenteEvent) => {
      if (e.type === "tool") setMsgs((m) => [...m, { de: "tool", t: `Consultando: ${e.name}` }]);
      else if (e.type === "token") ensureBot(e.text);
      else if (e.type === "error") setMsgs((m) => [...m, { de: "bot", t: `⚠️ ${e.text}` }]);
      scrollBottom();
    };

    try {
      await enviarMensaje(
        { sessionId, mensaje: texto, rol: identidad.rol, formadorId: identidad.formadorId, candId: identidad.candId },
        onEvent,
      );
    } catch (err) {
      setMsgs((m) => [...m, { de: "bot", t: `⚠️ ${(err as Error).message}` }]);
    } finally {
      setCargando(false);
      scrollBottom();
      onActividad?.();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
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
              <div className="chat-md">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ node, ...props }) => <div className="md-table-wrap"><table {...props} /></div>,
                    // Los enlaces del agente (CV, foto, video, docs…) se vuelven botones de descarga (demo).
                    a: ({ href, children }) => (
                      <button type="button" className="chat-file" title="Descargar (archivo de demostración)"
                        onClick={() => descargarDemo(textoDe(children) || href || "archivo")}>
                        <Download size={11} /> {children}
                      </button>
                    ),
                  }}
                >
                  {m.t}
                </ReactMarkdown>
              </div>
            ) : m.de === "tool" ? (
              <><Wrench size={11} />{m.t}</>
            ) : (
              <span style={{ whiteSpace: "pre-wrap" }}>{m.t}</span>
            )}
          </div>
        ))}
        {cargando && <div style={{ alignSelf: "flex-start", color: "var(--muted)", fontSize: 11 }}>El agente está pensando…</div>}
      </div>

      <div style={{ padding: 12, borderTop: "1px solid var(--line)", display: "flex", gap: 6, alignItems: "flex-end" }}>
        <textarea
          ref={inputRef}
          rows={1}
          style={{ flex: 1, fontSize: 12.5, padding: "8px 10px", border: "1px solid var(--line)", borderRadius: "var(--r-2)", background: "var(--input-bg)", color: "var(--ink)", outline: "none", resize: "none", overflowY: "auto", maxHeight: 110, lineHeight: 1.4 }}
          placeholder="Escribe tu instrucción…"
          value={input}
          onChange={(e) => { setInput(e.target.value); autosize(); }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); } }}
          disabled={cargando}
        />
        <button className="btn sm" onClick={enviar} disabled={cargando || !input.trim()} title="Enviar (Enter · Shift+Enter para salto de línea)">
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
