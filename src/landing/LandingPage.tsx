/**
 * Landing promocional de "/" (Radar de Candidatos). Envuelve el componente `Landing.jsx`
 * (contenido estático + login simulado) y le inyecta el callback de ingreso: al enviar el
 * formulario con CUALQUIER valor, entra a la plataforma en la vista del rol activo.
 */
import { useNavigate } from "react-router-dom";
import { useDemo } from "../contexts/DemoContext";
import Landing from "./Landing.jsx";

export function LandingPage() {
  const navigate = useNavigate();
  const { rol } = useDemo();
  return <Landing onIngresar={() => navigate(`/${rol}`)} />;
}
