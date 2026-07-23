/**
 * Chat DIRECTO persona↔persona dentro de la vista de chat (tab "Mensajes"). Dos paneles:
 *   - Lista de contactos/conversaciones (según rol y estado del proceso).
 *   - Hilo de la conversación seleccionada + input.
 * Responsive: en desktop se ven ambos paneles; en móvil, uno a la vez (lista → hilo con "volver").
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Send, ChevronLeft, MessageSquare } from "lucide-react";
import { useDemo } from "../../contexts/DemoContext";
import { useData } from "../../store/DataProvider";
import { Avatar } from "../common/Avatar";
import { contactosChat } from "../../utils/contactosChat";
import { directChatService, type ConversacionSrv, type ConvMensaje } from "../../services/directChatService";

const textoVacio = (rol: string): string =>
  rol === "candidato" ? "Podrás escribir a tu formador cuando pases la video-entrevista con IA."
    : rol === "formador" ? "Podrás escribir a un candidato cuando pase su video-entrevista con IA."
      : "Aquí aparecen los formadores de tus vacantes.";

export function MensajesPanel() {
  const { rol, formadorId, candId } = useDemo();
  const { vacantes, candidatos, formadores } = useData();
  const miId = rol === "formador" ? (formadorId ?? "") : rol === "candidato" ? String(candId ?? "") : "A1";

  const contactos = useMemo(
    () => contactosChat(rol, miId, vacantes, candidatos, formadores),
    [rol, miId, vacantes, candidatos, formadores],
  );

  const [convs, setConvs] = useState<ConversacionSrv[]>([]);
  const [activo, setActivo] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<ConvMensaje[] | null>(null);
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activoCont = contactos.find((c) => c.convId === activo) ?? null;
  const scrollBottom = () => queueMicrotask(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight));

  const cargarConvs = useCallback(async () => {
    try { setConvs(await directChatService.listar(rol, miId)); } catch { /* sin BD: lista vacía */ }
  }, [rol, miId]);
  useEffect(() => { void cargarConvs(); }, [cargarConvs]);

  // Cargar mensajes de la conversación activa.
  useEffect(() => {
    if (!activo) { setMensajes(null); return; }
    let vivo = true;
    setMensajes(null);
    (async () => {
      try { const m = await directChatService.mensajes(activo, rol, miId); if (vivo) setMensajes(m); }
      catch { if (vivo) setMensajes([]); }
    })();
    return () => { vivo = false; };
  }, [activo, rol, miId]);

  useEffect(scrollBottom, [mensajes]);

  const ultimoDe = (convId: string) => convs.find((c) => c.id === convId)?.ultimo;

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || enviando || !activoCont) return;
    setInput("");
    setEnviando(true);
    setMensajes((m) => [...(m ?? []), { autorTipo: rol, autorId: miId, contenido: texto, creadoTs: Date.now() }]);
    scrollBottom();
    try {
      await directChatService.enviar({ vacId: activoCont.vacId, rol, id: miId, para: activoCont.otro, contenido: texto });
      void cargarConvs();
    } catch {
      setMensajes((m) => [...(m ?? []), { autorTipo: "sistema", autorId: "", contenido: "⚠️ No se pudo enviar el mensaje.", creadoTs: Date.now() }]);
    } finally { setEnviando(false); scrollBottom(); }
  };

  return (
    <div className="dm" data-vista={activo ? "hilo" : "lista"}>
      <aside className="dm-list">
        <div className="dm-list-hd">{rol === "formador" ? "Candidatos" : "Formadores"}</div>
        <div className="dm-list-body">
          {contactos.length === 0 && <div className="help" style={{ padding: 12, lineHeight: 1.5 }}>{textoVacio(rol)}</div>}
          {contactos.map((c) => (
            <button key={c.convId} className={"dm-item" + (c.convId === activo ? " on" : "")} onClick={() => setActivo(c.convId)}>
              <Avatar nombre={c.otro.nombre} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="dm-item-nom">{c.otro.nombre}</div>
                <div className="dm-item-sub">{c.vacTitulo}</div>
                {ultimoDe(c.convId) && <div className="dm-item-last">{ultimoDe(c.convId)}</div>}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="dm-thread">
        {!activoCont ? (
          <div className="dm-empty">
            <MessageSquare size={30} color="var(--gray)" />
            <p>Elige una conversación para empezar a chatear.</p>
          </div>
        ) : (
          <>
            <div className="dm-thread-hd">
              <button className="dm-back" title="Volver" onClick={() => setActivo(null)}><ChevronLeft size={18} /></button>
              <Avatar nombre={activoCont.otro.nombre} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="dm-item-nom">{activoCont.otro.nombre}</div>
                <div className="dm-item-sub">{activoCont.vacTitulo}</div>
              </div>
            </div>

            <div ref={scrollRef} className="dm-msgs">
              {mensajes === null ? (
                <div className="help" style={{ margin: "auto" }}>Cargando…</div>
              ) : mensajes.length === 0 ? (
                <div className="help" style={{ margin: "auto", textAlign: "center", padding: 20 }}>Aún no hay mensajes. ¡Escribe el primero!</div>
              ) : (
                mensajes.map((m, i) => {
                  const mio = m.autorTipo === rol && m.autorId === miId;
                  const sistema = m.autorTipo === "sistema";
                  return (
                    <div key={i} className={"dm-msg" + (sistema ? " sys" : mio ? " mio" : "")}>
                      <span style={{ whiteSpace: "pre-wrap" }}>{m.contenido}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="dm-input">
              <textarea rows={1} value={input} placeholder="Escribe un mensaje…"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void enviar(); } }}
                disabled={enviando} />
              <button className="btn gold sm" onClick={() => void enviar()} disabled={enviando || !input.trim()} title="Enviar (Enter)">
                <Send size={15} />
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
