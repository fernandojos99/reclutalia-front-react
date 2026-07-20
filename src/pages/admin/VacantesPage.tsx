/** Admin · listado de vacantes + edición del descriptivo con nota al reenviar (port fiel). */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ShieldCheck, User, AlertCircle, CheckCircle2, Edit3, Send } from "lucide-react";
import { useData } from "../../store/DataProvider";
import { useDemo } from "../../contexts/DemoContext";
import { Chip } from "../../components/common/Chip";
import { FasesBar } from "../../components/common/FasesBar";
import { Modal } from "../../components/common/Modal";
import { CambiosResumen } from "../../components/common/CambiosResumen";
import { VacanteForm } from "../../components/admin/VacanteForm";
import { candidatoElegido } from "../../utils/fases";
import type { Requisito, Vacante } from "../../types/models/domain";

export function AdminVacantesPage() {
  const { vacantes, formadores, actions } = useData();
  const { toast } = useDemo();
  const navigate = useNavigate();
  const [editV, setEditV] = useState<Vacante | null>(null);
  const [confirmSave, setConfirmSave] = useState<{ req: Requisito; rech: string[] } | null>(null);
  const [nota, setNota] = useState("");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button className="btn gold" onClick={() => navigate("/admin/nueva")}><Plus size={15} /> Nueva vacante</button>
      </div>
      {vacantes.map((v) => (
        <div className={"card" + (v.estado === "cerrada" ? " ok" : "")} key={v.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <b>{v.req.titulo}</b><Chip>{v.id}</Chip>
            {v.req.tipoVacante === "Confidencial" && <Chip tone="gold" icon={ShieldCheck}>Confidencial</Chip>}
            <Chip icon={User}>Formador: {formadores.find((f) => f.id === v.formadorId)?.nombre || "—"}</Chip>
            {v.estado === "asignada" && <Chip tone="gold">En revisión del formador</Chip>}
            {v.estado === "cambios" && <Chip tone="bad" icon={AlertCircle}>Cambios solicitados</Chip>}
            {v.estado === "abierta" && (candidatoElegido(v) ? <Chip tone="ok" icon={CheckCircle2}>Candidato elegido</Chip> : <Chip tone="ok">Búsqueda activa</Chip>)}
            {v.estado === "cerrada" && <Chip tone="ok" icon={CheckCircle2}>Cubierta</Chip>}
            <span style={{ marginLeft: "auto" }}>
              {["asignada", "cambios"].includes(v.estado) && <button className="btn ghost sm" onClick={() => setEditV(v)}><Edit3 size={12} /> Editar descriptivo</button>}
            </span>
          </div>
          {v.estado === "cambios" && <div className="card" style={{ marginTop: 10, background: "var(--bad-soft)", borderColor: "#F0C4C1", padding: "10px 14px", fontSize: 12.5 }}><b>El formador solicitó:</b><CambiosResumen cambios={v.cambios} /></div>}
          <div style={{ marginTop: 12 }}><FasesBar v={v} compact /></div>
        </div>
      ))}

      {editV && (
        <Modal onClose={() => setEditV(null)} wide>
          <h3 style={{ marginBottom: 8 }}>Editar descriptivo · {editV.id}</h3>
          {editV.historial.length > 0 && (
            <div style={{ maxHeight: 110, overflowY: "auto", border: "1px solid var(--line)", borderRadius: 10, padding: "8px 12px", marginBottom: 12 }}>
              <label>Historial del descriptivo</label>
              {editV.historial.map((h, i) => <div key={i} className="help">• {h}</div>)}
            </div>
          )}
          <VacanteForm inicial={editV.req} cambios={editV.cambios} saveLabel="Guardar y reenviar al formador"
            onSave={(req, rech) => setConfirmSave({ req, rech })} />
        </Modal>
      )}

      {confirmSave && (
        <Modal onClose={() => setConfirmSave(null)}>
          <h3 style={{ marginBottom: 6 }}>Reenviar descriptivo al formador</h3>
          <p className="help" style={{ marginBottom: 14 }}>Si lo requieres, agrega una nota o comentario sobre los ajustes realizados o rechazados. Quedará registrada en el historial del descriptivo, visible para ti y para el formador.</p>
          <label>Nota o comentario (opcional)</label>
          <textarea rows={3} value={nota} onChange={(e) => setNota(e.target.value)} placeholder="p. ej. Ajusté el rango salarial al tabulador vigente; el radio de búsqueda no puede ampliarse por política interna…" />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button className="btn gold" onClick={() => { if (editV) void actions.editarVacante(editV.id, confirmSave.req, confirmSave.rech, nota.trim()); setConfirmSave(null); setEditV(null); setNota(""); toast("Descriptivo actualizado · el formador fue notificado"); }}><Send size={15} /> Guardar y reenviar</button>
            <button className="btn ghost" onClick={() => setConfirmSave(null)}>Volver al formulario</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
