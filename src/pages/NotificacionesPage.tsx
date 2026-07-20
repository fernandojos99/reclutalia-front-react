/** Centro de notificaciones (port fiel de `NotifList`): marca leídas al abrir; el formador puede ir a la vacante. */
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronRight } from "lucide-react";
import { useData } from "../store/DataProvider";
import { useDemo } from "../contexts/DemoContext";
import type { RolNotificacion } from "../types/models/domain";

export function NotificacionesPage() {
  const { rol, formadorId, candId } = useDemo();
  const { notificaciones, marcarLeida } = useData();
  const navigate = useNavigate();
  const yaMarcado = useRef(false);

  const para = useMemo<{ tipo: RolNotificacion; id: string | number }>(() => {
    if (rol === "formador") return { tipo: "formador", id: formadorId };
    if (rol === "candidato") return { tipo: "candidato", id: candId };
    return { tipo: "admin", id: "A1" };
  }, [rol, formadorId, candId]);

  const lista = notificaciones.filter((n) => n.para.tipo === para.tipo && String(n.para.id) === String(para.id));

  // Marca como leídas al abrir la vista (una sola vez por montaje).
  useEffect(() => {
    if (yaMarcado.current) return;
    yaMarcado.current = true;
    lista.filter((n) => !n.leida).forEach((n) => void marcarLeida(n.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!lista.length) {
    return <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--gray)" }}><Bell size={24} style={{ marginBottom: 8 }} /><p>Sin notificaciones por ahora.</p></div>;
  }

  return (
    <div>
      {lista.map((n) => (
        <div key={n.id} className={"notif" + (n.leida ? "" : " unread")}>
          <Bell size={16} color="var(--gold-dark)" style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: 13.5 }}>{n.titulo}</b>
            <div style={{ fontSize: 12.5, color: "var(--ink2)", marginTop: 3, lineHeight: 1.5 }}>{n.msg}</div>
            <div className="help" style={{ marginTop: 4 }}>{n.fecha}{n.vacId ? ` · Vacante ${n.vacId}` : ""}</div>
          </div>
          {n.vacId && rol === "formador" && (
            <button className="btn ghost sm" onClick={() => navigate(`/formador/vacante/${n.vacId}`)}>Abrir <ChevronRight size={12} /></button>
          )}
        </div>
      ))}
    </div>
  );
}
