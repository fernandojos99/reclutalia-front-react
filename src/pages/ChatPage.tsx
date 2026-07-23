/**
 * Vista integrada del Agente IA (misma funcionalidad que el bot flotante, reutilizando <AgentChat/>),
 * con administración de múltiples sesiones persistentes en BD: crear, renombrar, eliminar, cambiar
 * de sesión y recordar la última usada por usuario. El historial sobrevive a cold starts (BD).
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, MessageSquare, Trash2, Pencil, Check } from "lucide-react";
import { useDemo } from "../contexts/DemoContext";
import { AgentChat, type Mensaje } from "../components/agente/AgentChat";
import { chatService, type ChatSesion, type Identidad } from "../services/chatService";

const lastKey = (id: Identidad) => `reclutalia_chat_last_${id.rol}_${id.formadorId ?? id.candId ?? ""}`;

export function ChatPage() {
  const { rol, formadorId, candId } = useDemo();
  const identidad = useMemo<Identidad>(() => ({ rol, formadorId, candId }), [rol, formadorId, candId]);

  const [sesiones, setSesiones] = useState<ChatSesion[]>([]);
  const [activa, setActiva] = useState<string | null>(null);
  const [historial, setHistorial] = useState<Mensaje[] | null>(null); // null = cargando
  const [cargandoSes, setCargandoSes] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTxt, setEditTxt] = useState("");

  const bienvenida = useMemo<Mensaje>(() => ({
    de: "bot",
    t: `Soy tu agente IA. Estás como **${rol}**. Puedo consultar y operar el sistema por ti: pídeme, por ejemplo, *"lista mis vacantes"* o *"¿cómo va mi proceso?"*. Crea varias conversaciones y retoma cualquiera cuando quieras.`,
  }), [rol]);

  const cargarSesiones = useCallback(async (): Promise<ChatSesion[]> => {
    const lista = await chatService.listar(identidad);
    setSesiones(lista);
    return lista;
  }, [identidad]);

  // Carga inicial: lista de sesiones + elegir la recordada / más reciente / crear una.
  useEffect(() => {
    let vivo = true;
    (async () => {
      setCargandoSes(true);
      try {
        let lista = await cargarSesiones();
        if (!vivo) return;
        if (!lista.length) {
          const nueva = await chatService.crear(identidad);
          if (!vivo) return;
          lista = [nueva];
          setSesiones(lista);
        }
        const recordada = localStorage.getItem(lastKey(identidad));
        setActiva(recordada && lista.some((s) => s.id === recordada) ? recordada : lista[0].id);
      } catch {
        /* sin BD/endpoint: la vista queda vacía, el bot flotante sigue funcionando */
      } finally {
        if (vivo) setCargandoSes(false);
      }
    })();
    return () => { vivo = false; };
  }, [cargarSesiones, identidad]);

  // Al cambiar de sesión activa: recordarla y cargar su historial.
  useEffect(() => {
    if (!activa) return;
    let vivo = true;
    setHistorial(null);
    localStorage.setItem(lastKey(identidad), activa);
    (async () => {
      try {
        const msgs = await chatService.mensajes(activa);
        if (vivo) setHistorial(msgs.length ? msgs : [bienvenida]);
      } catch {
        if (vivo) setHistorial([bienvenida]);
      }
    })();
    return () => { vivo = false; };
  }, [activa, identidad, bienvenida]);

  const nueva = async () => {
    const s = await chatService.crear(identidad);
    setSesiones((xs) => [s, ...xs]);
    setActiva(s.id);
  };

  const eliminar = async (id: string) => {
    await chatService.eliminar(id);
    const restantes = sesiones.filter((s) => s.id !== id);
    setSesiones(restantes);
    if (activa === id) {
      if (restantes.length) setActiva(restantes[0].id);
      else { const s = await chatService.crear(identidad); setSesiones([s]); setActiva(s.id); }
    }
  };

  const guardarNombre = async (id: string) => {
    const t = editTxt.trim();
    if (t) {
      await chatService.renombrar(id, t);
      setSesiones((xs) => xs.map((s) => (s.id === id ? { ...s, titulo: t } : s)));
    }
    setEditId(null);
  };

  return (
    <div className="chatpage">
      <aside className="chatpage-side">
        <button className="btn gold sm" style={{ width: "100%", justifyContent: "center" }} onClick={() => void nueva()}>
          <Plus size={14} /> Nueva conversación
        </button>
        <div className="chatpage-seslist">
          {cargandoSes && <div className="help" style={{ padding: 8 }}>Cargando conversaciones…</div>}
          {!cargandoSes && sesiones.length === 0 && <div className="help" style={{ padding: 8 }}>Aún no hay conversaciones.</div>}
          {sesiones.map((s) => (
            <div key={s.id} className={"chat-ses" + (s.id === activa ? " on" : "")} onClick={() => setActiva(s.id)}>
              {editId === s.id ? (
                <>
                  <input autoFocus value={editTxt} onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setEditTxt(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") void guardarNombre(s.id); if (e.key === "Escape") setEditId(null); }}
                    style={{ flex: 1, fontSize: 12, minWidth: 0, padding: "3px 6px" }} />
                  <button className="iconact" title="Guardar" onClick={(e) => { e.stopPropagation(); void guardarNombre(s.id); }}><Check size={13} /></button>
                </>
              ) : (
                <>
                  <MessageSquare size={13} style={{ flexShrink: 0, color: "var(--gray)" }} />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12.5 }}>{s.titulo}</span>
                  <button className="iconact" title="Renombrar" onClick={(e) => { e.stopPropagation(); setEditId(s.id); setEditTxt(s.titulo); }}><Pencil size={12} /></button>
                  <button className="iconact" title="Eliminar" onClick={(e) => { e.stopPropagation(); void eliminar(s.id); }}><Trash2 size={12} /></button>
                </>
              )}
            </div>
          ))}
        </div>
      </aside>

      <section className="chatpage-main">
        {activa && historial !== null ? (
          <AgentChat key={activa} sessionId={activa} identidad={identidad} initial={historial}
            onActividad={() => { void cargarSesiones(); }} />
        ) : (
          <div className="help" style={{ margin: "auto", padding: 24 }}>Cargando conversación…</div>
        )}
      </section>
    </div>
  );
}
