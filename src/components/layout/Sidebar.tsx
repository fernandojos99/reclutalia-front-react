/**
 * Barra lateral: navegación por rol + selector demo de rol / formador / candidato / tema.
 * Portado del bloque `<aside className="side">` del App original. Usa react-router para navegar.
 */
import { NavLink } from "react-router-dom";
import { Home, Bell, LayoutGrid, Plus, Users, Briefcase, Search, X } from "lucide-react";
import { useDemo, type Rol } from "../../contexts/DemoContext";
import { resetSessionId } from "../../services/agenteService";
import { THEMES } from "../../styles/themes";
import type { Formador, Candidato } from "../../types/models/domain";

interface SidebarProps {
  formadores: Formador[];
  candidatos: Candidato[];
  noLeidas: number;
  /** En móvil el sidebar es un drawer: `open` lo muestra, `onClose` lo cierra. */
  open?: boolean;
  onClose?: () => void;
}

const navPorRol: Record<Rol, { to: string; icon: typeof Home; label: string; end?: boolean }[]> = {
  formador: [
    { to: "/formador", icon: Home, label: "Mis vacantes", end: true },
    { to: "/formador/notificaciones", icon: Bell, label: "Notificaciones" },
  ],
  admin: [
    { to: "/admin", icon: LayoutGrid, label: "Vacantes", end: true },
    { to: "/admin/nueva", icon: Plus, label: "Nueva vacante" },
    { to: "/admin/pool", icon: Users, label: "Pool de talento" },
    { to: "/admin/notificaciones", icon: Bell, label: "Notificaciones" },
  ],
  candidato: [
    { to: "/candidato", icon: Briefcase, label: "Mis procesos", end: true },
    { to: "/candidato/buscar", icon: Search, label: "Buscar vacantes" },
    { to: "/candidato/notificaciones", icon: Bell, label: "Notificaciones" },
  ],
};

export function Sidebar({ formadores, candidatos, noLeidas, open = false, onClose }: SidebarProps) {
  const { rol, setRol, formadorId, setFormadorId, candId, setCandId, tema, setTema } = useDemo();

  // Al cambiar de perfil recargamos la página a propósito: así se resetea el asistente de IA
  // (estado del chat) y, olvidando el sessionId, también su memoria en el servidor.
  // El perfil se persiste en localStorage (DemoContext), por eso sobrevive a la recarga.
  const recargarConNuevoPerfil = (destino: string) => {
    resetSessionId();
    window.location.assign(destino);
  };

  const cambiarRol = (r: Rol) => {
    setRol(r);
    recargarConNuevoPerfil(`/${r}`);
  };

  const cambiarFormador = (id: string) => {
    setFormadorId(id);
    recargarConNuevoPerfil("/formador");
  };

  const cambiarCandidato = (id: number) => {
    setCandId(id);
    recargarConNuevoPerfil("/candidato");
  };

  return (
    <>
      {open && <div className="side-backdrop" onClick={onClose} />}
      <aside className={"side" + (open ? " open" : "")}>
      <div className="logo">
        <div className="mark">R</div>
        <div>
          <b>Radar de candidatos</b>
          <span>COBERTURA DE VACANTES</span>
        </div>
        <button className="iconbtn side-close" title="Cerrar menú" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {navPorRol[rol].map(({ to, icon: Icon, label, end }) => (
        <NavLink key={to} to={to} end={end} onClick={onClose}
          className={({ isActive }) => "nav-item" + (isActive ? " on" : "")}>
          <Icon size={16} />
          {label}
          {label === "Notificaciones" && noLeidas > 0 && (
            <span className="chip gold" style={{ marginLeft: "auto" }}>{noLeidas}</span>
          )}
        </NavLink>
      ))}

      <div className="rolebox">
        <p>VISTA DEMO — CAMBIAR ROL</p>
        <select value={rol} onChange={(e) => cambiarRol(e.target.value as Rol)}>
          <option value="formador">Formador de equipo</option>
          <option value="admin">Administrador</option>
          <option value="candidato">Candidato</option>
        </select>

        {rol === "formador" && (
          <select style={{ marginTop: 8 }} value={formadorId} onChange={(e) => cambiarFormador(e.target.value)}>
            {formadores.map((f) => (
              <option key={f.id} value={f.id}>{f.nombre}</option>
            ))}
          </select>
        )}

        {rol === "candidato" && (
          <select style={{ marginTop: 8 }} value={candId} onChange={(e) => cambiarCandidato(Number(e.target.value))}>
            {candidatos.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        )}

        <p style={{ marginTop: 12 }}>VISTA DEMO — CAMBIAR ESTILO</p>
        <select style={{ marginTop: 8 }} value={tema} onChange={(e) => setTema(e.target.value)}>
          {Object.values(THEMES).map((t) => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>
      </div>
    </aside>
    </>
  );
}
