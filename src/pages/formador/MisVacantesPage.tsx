/** Inicio del formador (port fiel de `FormadorHome`): stats + vacantes con FasesBar compacta. */
import { useNavigate } from "react-router-dom";
import { AlertCircle, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { useData } from "../../store/DataProvider";
import { useDemo } from "../../contexts/DemoContext";
import { Chip } from "../../components/common/Chip";
import { FasesBar } from "../../components/common/FasesBar";
import { candidatoElegido } from "../../utils/fases";
import { PIPE_IDX } from "../../constants/catalogos";

export function MisVacantesPage() {
  const { formadorId } = useDemo();
  const { vacantes, notificaciones, loading } = useData();
  const navigate = useNavigate();

  if (loading) return <p>Cargando…</p>;

  const mias = vacantes.filter((v) => v.formadorId === formadorId);
  const pend = notificaciones.filter((n) => n.para.tipo === "formador" && n.para.id === formadorId && !n.leida).length;
  const activos = mias.reduce(
    (a, v) => a + Object.values(v.pipeline).filter((p) => (PIPE_IDX[p.estado] ?? -1) >= 0 && p.estado !== "contratado").length,
    0,
  );

  return (
    <div>
      <div className="grid3" style={{ marginBottom: 18 }}>
        <div className="stat"><b>{mias.filter((v) => v.estado !== "cerrada").length}</b><span>Vacantes activas a tu cargo</span></div>
        <div className="stat"><b>{activos}</b><span>Candidatos en proceso</span></div>
        <div className="stat"><b style={{ color: pend ? "var(--gold-dark)" : "inherit" }}>{pend}</b><span>Notificaciones sin leer</span></div>
      </div>
      <h3 style={{ margin: "4px 0 12px", fontSize: 15 }}>Tus vacantes y su avance en el proceso</h3>
      {mias.map((v) => {
        const enProceso = Object.keys(v.pipeline).length;
        return (
          <div className={"card" + (v.estado === "cerrada" ? " ok" : "")} key={v.id} style={{ marginBottom: 14, cursor: "pointer" }}
            onClick={() => navigate(`/formador/vacante/${v.id}`)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <b style={{ fontSize: 15 }}>{v.req.titulo}</b><Chip>{v.id}</Chip>
              {v.estado === "asignada" && <Chip tone="gold" icon={AlertCircle}>Requiere tu revisión</Chip>}
              {v.estado === "cambios" && <Chip icon={Clock}>Esperando al admin</Chip>}
              {v.estado === "abierta" && (candidatoElegido(v) ? <Chip tone="ok" icon={CheckCircle2}>Candidato elegido</Chip> : <Chip tone="ok">Búsqueda activa</Chip>)}
              {v.estado === "cerrada" && <Chip tone="ok" icon={CheckCircle2}>Cubierta</Chip>}
              <span style={{ marginLeft: "auto" }} className="help">{enProceso ? enProceso + " candidato(s) en proceso · " : ""}Creada {v.creada}</span>
              <ChevronRight size={16} color="var(--gray)" />
            </div>
            <div style={{ marginTop: 12 }}><FasesBar v={v} compact /></div>
          </div>
        );
      })}
      {!mias.length && <div className="card" style={{ textAlign: "center", color: "var(--gray)", padding: 36 }}>El administrador aún no te asigna vacantes.</div>}
    </div>
  );
}
