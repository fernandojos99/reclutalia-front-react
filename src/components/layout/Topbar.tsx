/** Barra superior: título de la vista + campana de notificaciones + identidad del usuario activo. */
import { Bell, Edit3 } from "lucide-react";
import { Avatar } from "../common/Avatar";

interface TopbarProps {
  titulo: string;
  nombre: string;
  subtitulo: string;
  foto?: string | null;
  noLeidas: number;
  onEditarPerfil?: () => void;
}

export function Topbar({ titulo, nombre, subtitulo, foto, noLeidas, onEditarPerfil }: TopbarProps) {
  return (
    <header className="topbar">
      <div style={{ flex: 1 }}>
        <h2>{titulo}</h2>
      </div>
      <button className="iconbtn" title="Notificaciones">
        <Bell size={17} />
        {noLeidas > 0 && <span className="dot">{noLeidas}</span>}
      </button>
      <div onClick={onEditarPerfil} title={onEditarPerfil ? "Editar perfil" : undefined}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: onEditarPerfil ? "pointer" : "default" }}>
        <Avatar nombre={nombre} foto={foto} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{nombre}</div>
          <div style={{ fontSize: 11, color: "var(--gray)" }}>{subtitulo}</div>
        </div>
      </div>
      {onEditarPerfil && <button className="btn ghost sm" onClick={onEditarPerfil}><Edit3 size={13} /> Editar perfil</button>}
    </header>
  );
}
