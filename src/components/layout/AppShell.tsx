/**
 * Shell de la app: sidebar + topbar + contenido (Outlet) + toast + bot + inyección de temas.
 * Reemplaza al render raíz del `App` original. El `data-theme` sale del DemoContext y los datos
 * (para el badge de notificaciones y los selectores) del DataProvider.
 */
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BotSoporte } from "./BotSoporte";
import { PerfilEditor } from "../candidato/PerfilEditor";
import { useDemo } from "../../contexts/DemoContext";
import { useData } from "../../store/DataProvider";
import { buildThemeCss } from "../../styles/themes";

const ADMIN = { nombre: "Carlos Ruiz Delgado", puesto: "Administrador · Talento GS" };
const THEME_CSS = buildThemeCss();

function tituloPorRuta(pathname: string): string {
  if (pathname.includes("/notificaciones")) return "Centro de notificaciones";
  if (pathname.startsWith("/formador/vacante")) return "Detalle de vacante";
  if (pathname.startsWith("/formador")) return "Mis vacantes";
  if (pathname === "/admin/nueva") return "Nueva vacante";
  if (pathname === "/admin/pool") return "Inventario de talento (marketplace)";
  if (pathname.startsWith("/admin")) return "Vacantes";
  if (pathname === "/candidato/buscar") return "Buscar vacantes";
  if (pathname.startsWith("/candidato")) return "Mis procesos";
  return "Radar de Candidatos";
}

export function AppShell() {
  const { rol, formadorId, candId, tema, toastMsg, toast } = useDemo();
  const { formadores, candidatos, notificaciones, actions } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [editPerfil, setEditPerfil] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // drawer del sidebar en móvil

  // Cerrar el drawer al cambiar de ruta (p.ej. tras tocar un ítem de navegación).
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const noLeidas = useMemo(() => {
    const para =
      rol === "formador" ? { tipo: "formador", id: formadorId }
        : rol === "candidato" ? { tipo: "candidato", id: candId }
          : { tipo: "admin", id: "A1" };
    return notificaciones.filter(
      (n) => n.para.tipo === para.tipo && String(n.para.id) === String(para.id) && !n.leida,
    ).length;
  }, [notificaciones, rol, formadorId, candId]);

  const formador = formadores.find((f) => f.id === formadorId);
  const candidato = candidatos.find((c) => c.id === candId);
  const identidad =
    rol === "formador"
      ? { nombre: formador?.nombre ?? "Formador", subtitulo: formador?.puesto ?? "", foto: null as string | null }
      : rol === "candidato"
        ? { nombre: candidato?.nombre ?? "Candidato", subtitulo: "Candidato", foto: candidato?.foto ?? null }
        : { nombre: ADMIN.nombre, subtitulo: ADMIN.puesto, foto: null };

  return (
    <div className="rk" data-theme={tema}>
      <style>{THEME_CSS}</style>
      <Sidebar formadores={formadores} candidatos={candidatos} noLeidas={noLeidas}
        open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main">
        <Topbar titulo={tituloPorRuta(location.pathname)} nombre={identidad.nombre}
          subtitulo={identidad.subtitulo} foto={identidad.foto} noLeidas={noLeidas}
          onMenu={() => setMenuOpen(true)}
          onNotificaciones={() => navigate(`/${rol}/notificaciones`)}
          onEditarPerfil={rol === "candidato" && candidato ? () => setEditPerfil(true) : undefined} />
        <div className="content">
          <Outlet />
        </div>
      </div>
      <BotSoporte />
      {editPerfil && candidato && (
        <PerfilEditor cand={candidato} onClose={() => setEditPerfil(false)}
          onSave={(c) => { void actions.guardarCandidato(c); setEditPerfil(false); toast("Perfil actualizado"); }} />
      )}
      {toastMsg && (
        <div className="toast">
          <CheckCircle2 size={15} color="var(--gold)" />
          {toastMsg}
        </div>
      )}
    </div>
  );
}
