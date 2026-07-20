/** Modal para proponer 3 horarios de entrevista (portado del `AgendaModal`). */
import { useMemo, useState } from "react";
import { Link2, Calendar, CheckCircle2, Send } from "lucide-react";
import { Modal } from "../common/Modal";
import type { Candidato } from "../../types/models/domain";

interface Props {
  cands: Candidato[];
  onSend: (slots: string[], modalidad: string) => void;
  onClose: () => void;
}

export function AgendaModal({ cands, onSend, onClose }: Props) {
  const [conectado, setConectado] = useState(false);
  const [sel, setSel] = useState<string[]>([]);
  const [modalidad, setModalidad] = useState("Virtual (Teams)");

  const dias = useMemo(() => {
    const out: Date[] = [];
    const d = new Date();
    while (out.length < 3) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
    }
    return out;
  }, []);
  const horas = ["10:00", "12:00", "16:00", "17:30"];
  const slots = dias.flatMap((d) => horas.map((h) => d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" }) + " · " + h));
  const toggle = (s: string) => setSel((x) => (x.includes(s) ? x.filter((y) => y !== s) : x.length < 3 ? [...x, s] : x));

  return (
    <Modal onClose={onClose} wide>
      <h3>Agendar entrevista</h3>
      <p className="help" style={{ marginBottom: 14 }}>Propón <b>3 horarios</b> a {cands.map((c) => c.nombre.split(" ")[0]).join(", ")}. Cada candidato confirmará el que le acomode.</p>
      {!conectado ? (
        <div className="card" style={{ textAlign: "center", padding: "34px 20px" }}>
          <Link2 size={28} color="var(--ai)" style={{ marginBottom: 10 }} />
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>Conecta tu calendario corporativo</h3>
          <p className="help" style={{ marginBottom: 16 }}>Vincula Outlook / Teams para ver tu disponibilidad real y generar las reuniones automáticamente.</p>
          <button className="btn ai" onClick={() => setConectado(true)}><Calendar size={15} /> Conectar Outlook / Teams</button>
          <div className="help" style={{ marginTop: 10 }}>Integración simulada en este prototipo.</div>
        </div>
      ) : (
        <>
          <div className="chip ok" style={{ marginBottom: 12 }}><CheckCircle2 size={12} /> Calendario de Outlook sincronizado · mostrando tus espacios libres</div>
          <div className="field">
            <label>Modalidad de la entrevista</label>
            <div className="tagpick">{["Virtual (Teams)", "Presencial"].map((m) => <button key={m} className={"tag" + (modalidad === m ? " on" : "")} onClick={() => setModalidad(m)}>{m}</button>)}</div>
          </div>
          <label>Elige 3 horarios disponibles ({sel.length}/3)</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 6 }}>
            {slots.map((s) => <button key={s} className={"slotbtn" + (sel.includes(s) ? " on" : "")} onClick={() => toggle(s)}>{s}</button>)}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn gold" disabled={sel.length !== 3} onClick={() => onSend(sel, modalidad)}><Send size={15} /> Enviar opciones a {cands.length} candidato(s)</button>
            <button className="btn ghost" onClick={onClose}>Cancelar</button>
          </div>
        </>
      )}
    </Modal>
  );
}
