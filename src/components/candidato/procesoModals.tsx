/** Modales/piezas del proceso del candidato (portados de App.jsx). */
import { useMemo, useState } from "react";
import {
  Video, Sparkles, Bot, ChevronRight, CheckCircle2, Search, CalendarCheck, AlertCircle, Send, XCircle,
} from "lucide-react";
import { Modal } from "../common/Modal";
import { proximosDias } from "../../utils/format";
import { SUCURSALES_MEDICAS } from "../../constants/catalogos";
import type { Candidato, Vacante } from "../../types/models/domain";

export function VideoIAModal({ v, onDone, onClose }: { cand: Candidato; v: Vacante; onDone: () => void; onClose: () => void }) {
  const [paso, setPaso] = useState(0);
  const pregs = [
    "Preséntate brevemente: trayectoria, especialidad y lo que buscas en tu siguiente reto.",
    `Esta vacante requiere ${v.req.hardSkills.slice(0, 2).join(" y ")}. Cuéntame un proyecto donde los aplicaste.`,
    `¿Cómo describirías tu nivel en ${v.req.espRequeridas[0] || v.req.area}? Da un ejemplo concreto.`,
    "Describe una situación difícil con un cliente o compañero y cómo la resolviste.",
    "¿Por qué te interesa esta posición y qué disponibilidad tienes?",
  ];
  return (
    <Modal onClose={onClose} wide>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Video size={18} color="var(--ai)" /><h3>Video-entrevista con agente de IA</h3>
        <span className="chip ai" style={{ marginLeft: "auto" }}><Sparkles size={11} /> Grabando (simulado)</span>
      </div>
      <div style={{ background: "var(--ink)", borderRadius: 14, height: 170, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 58, height: 58, borderRadius: 99, background: "var(--ai)", display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={28} color="#fff" /></div>
        <span style={{ color: "#C9C9C9", fontSize: 12 }}>Agente IA de Radar de candidatos · videollamada simulada</span>
      </div>
      <div className="aibox">
        <div className="hd">Pregunta {paso + 1} de {pregs.length}</div>
        <p style={{ fontSize: 14, lineHeight: 1.55 }}>{pregs[paso]}</p>
      </div>
      <div className="mini-pipe" style={{ margin: "12px 0" }}>{pregs.map((_, i) => <i key={i} className={i <= paso ? "f" : ""} />)}</div>
      {paso < pregs.length - 1
        ? <button className="btn ai" onClick={() => setPaso(paso + 1)}>He respondido · siguiente pregunta <ChevronRight size={15} /></button>
        : <button className="btn gold" onClick={onDone}><CheckCircle2 size={15} /> Finalizar video-entrevista</button>}
    </Modal>
  );
}

interface MedicoDatos { estado: string; ciudad: string; municipio: string; sucursal: string; fecha: string; }
export function MedicoAgendar({ onAgendar }: { onAgendar: (datos: MedicoDatos) => void }) {
  const [estado, setEstado] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [busco, setBusco] = useState(false);
  const [suc, setSuc] = useState("");
  const [fecha, setFecha] = useState("");
  const dias = useMemo(() => proximosDias(7), []);
  const ubicOk = estado.trim() && ciudad.trim() && municipio.trim();
  return (
    <div style={{ marginTop: 8 }}>
      <div className="help" style={{ marginBottom: 8 }}>Agenda tu examen médico dentro de la próxima semana en una sucursal autorizada cercana a tu ubicación.</div>
      <div className="grid3">
        <div className="field" style={{ marginBottom: 8 }}><label>Estado</label><input value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="p. ej. Ciudad de México" /></div>
        <div className="field" style={{ marginBottom: 8 }}><label>Ciudad</label><input value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="p. ej. CDMX" /></div>
        <div className="field" style={{ marginBottom: 8 }}><label>Municipio / alcaldía</label><input value={municipio} onChange={(e) => setMunicipio(e.target.value)} placeholder="p. ej. Tlalpan" /></div>
      </div>
      <button className="btn dark sm" disabled={!ubicOk} onClick={() => setBusco(true)}><Search size={13} /> Buscar sucursales autorizadas</button>
      {!ubicOk && <div className="help" style={{ marginTop: 6 }}>Captura tu estado, ciudad y municipio para ver las sucursales cercanas.</div>}
      {busco && ubicOk && (
        <>
          <label style={{ marginTop: 14 }}>Sucursales autorizadas cerca de tu ubicación</label>
          {SUCURSALES_MEDICAS.map((s) => (
            <label key={s.nombre} className={"check-item" + (suc === s.nombre ? " done" : "")} style={{ cursor: "pointer", fontWeight: 400, marginTop: 6 }}>
              <input type="radio" name="sucmed" style={{ width: "auto", marginRight: 6 }} checked={suc === s.nombre} onChange={() => setSuc(s.nombre)} />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{s.nombre}</div><div className="help">{s.dir}</div></div>
            </label>
          ))}
          <div className="field" style={{ marginTop: 12, marginBottom: 8 }}><label>Fecha de la cita (dentro de los próximos 7 días)</label>
            <select value={fecha} onChange={(e) => setFecha(e.target.value)}><option value="">Selecciona una fecha…</option>{dias.map((d) => <option key={d}>{d}</option>)}</select></div>
          <button className="btn gold" disabled={!suc || !fecha} onClick={() => onAgendar({ estado, ciudad, municipio, sucursal: suc, fecha })}><CalendarCheck size={15} /> Agendar examen médico</button>
        </>
      )}
    </div>
  );
}

export function CuentaBancoModal({ actual, onSave, onClose }: { actual: string; onSave: (num: string) => void; onClose: () => void }) {
  const [num, setNum] = useState(actual || "");
  const limpio = num.replace(/\D/g, "");
  const valido = limpio.length >= 10 && limpio.length <= 18;
  return (
    <Modal onClose={onClose}>
      <h3 style={{ marginBottom: 6 }}>Número de cuenta para nómina</h3>
      <p className="help" style={{ marginBottom: 14 }}>Captura el número de cuenta o CLABE interbancaria (10 a 18 dígitos) donde recibirás tu sueldo. Podrás modificarlo después si lo necesitas.</p>
      <div className="field">
        <label>Número de cuenta / CLABE</label>
        <input value={num} onChange={(e) => setNum(e.target.value)} placeholder="Ej. 012180001234567895" inputMode="numeric" />
        {num && !valido && <div style={{ fontSize: 12, color: "var(--bad)", marginTop: 4 }}><AlertCircle size={12} style={{ verticalAlign: -2 }} /> Debe tener entre 10 y 18 dígitos.</div>}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button className="btn gold" disabled={!valido} onClick={() => onSave(limpio)}><CheckCircle2 size={15} /> Guardar cuenta</button>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

type Resp = Record<number, boolean>;
export function KillerPreguntas({ v, resp, setResp }: { v: Vacante; resp: Resp; setResp: React.Dispatch<React.SetStateAction<Resp>> }) {
  if (!v.req.killer.length) return null;
  return (
    <>
      <label>Preguntas filtro de la vacante</label>
      {v.req.killer.map((k, i) => (
        <div key={i} className="trow">
          <div style={{ flex: 1, fontSize: 13 }}>{k.q}</div>
          <div className="tagpick">
            <button className={"tag" + (resp[i] === true ? " on" : "")} onClick={() => setResp((r) => ({ ...r, [i]: true }))}>Sí</button>
            <button className={"tag" + (resp[i] === false ? " on" : "")} onClick={() => setResp((r) => ({ ...r, [i]: false }))}>No</button>
          </div>
        </div>
      ))}
    </>
  );
}

export function PostulacionForm({ v, onAplicar, onRechazar }: { v: Vacante; onAplicar: (ok: boolean) => void; onRechazar?: () => void }) {
  const [resp, setResp] = useState<Resp>({});
  const todas = v.req.killer.every((_, i) => resp[i] != null);
  const ok = v.req.killer.every((_, i) => resp[i] === true);
  return (
    <div>
      <KillerPreguntas v={v} resp={resp} setResp={setResp} />
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <button className="btn gold" disabled={v.req.killer.length > 0 && !todas} onClick={() => onAplicar(ok || v.req.killer.length === 0)}>
          <Send size={15} /> Postularme a esta vacante
        </button>
        {onRechazar && <button className="btn ghost" onClick={onRechazar}><XCircle size={15} /> Rechazar invitación</button>}
      </div>
      {v.req.killer.length > 0 && <div className="help" style={{ marginTop: 6 }}>Si alguna respuesta no cumple los requisitos indispensables, el sistema cerrará tu postulación automáticamente y te lo notificará.</div>}
    </div>
  );
}

export function RechazarInvitacionModal({ v, onRechazar, onClose }: { v: Vacante; onRechazar: (motivo: string) => void; onClose: () => void }) {
  const [motivo, setMotivo] = useState("");
  return (
    <Modal onClose={onClose}>
      <h3 style={{ marginBottom: 6 }}>Rechazar invitación</h3>
      <p className="help" style={{ marginBottom: 14 }}>Vas a rechazar la invitación a <b>"{v.req.titulo}"</b>. No continuarás en este proceso. Puedes indicar un motivo (opcional) que se compartirá con el formador.</p>
      <label>Motivo (opcional)</label>
      <textarea rows={3} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="p. ej. En este momento no busco un cambio, o el esquema no se ajusta a lo que necesito…" />
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button className="btn gold" onClick={() => onRechazar(motivo.trim())}><XCircle size={15} /> Rechazar invitación</button>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}
