/** Admin · alta de vacante con el wizard completo (port fiel del bloque "nueva" de AdminPanel). */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../store/DataProvider";
import { useDemo } from "../../contexts/DemoContext";
import { VacanteForm } from "../../components/admin/VacanteForm";

export function NuevaVacantePage() {
  const { formadores, actions } = useData();
  const { toast } = useDemo();
  const navigate = useNavigate();
  const [formadorSel, setFormadorSel] = useState(formadores[0]?.id ?? "F1");

  return (
    <div className="card">
      <h3 style={{ marginBottom: 4 }}>Nueva vacante · formulario estandarizado</h3>
      <p className="help" style={{ marginBottom: 14 }}>Llena los requerimientos y asígnala a un formador. Él podrá revisar, solicitar cambios y aprobar antes de iniciar la búsqueda.</p>
      <div className="field" style={{ maxWidth: 340 }}>
        <label>Asignar al formador</label>
        <select value={formadorSel} onChange={(e) => setFormadorSel(e.target.value)}>
          {formadores.map((f) => <option key={f.id} value={f.id}>{f.nombre} · {f.puesto}</option>)}
        </select>
      </div>
      <VacanteForm saveLabel="Crear y asignar al formador"
        onSave={(req) => { void actions.crearVacante(req, formadorSel); toast("Vacante creada y asignada · el formador fue notificado"); navigate("/admin"); }} />
    </div>
  );
}
