/**
 * Vista del descriptivo de la vacante con solicitud de cambios por campo (portado de App.jsx).
 * ⚠️ Row se INVOCA como función ({Row({...})}, no <Row/>) para que sus inputs no pierdan el foco.
 */
import { useState, type ReactNode } from "react";
import { Sparkles, Edit3, X, Send, Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { Chip } from "../common/Chip";
import { CambiosResumen } from "../common/CambiosResumen";
import { money } from "../../utils/format";
import type { Vacante } from "../../types/models/domain";

interface Props {
  v: Vacante;
  onAprobar: () => void;
  onCambios: (cambios: Record<string, string>) => void;
}

export function VistaDescriptivo({ v, onAprobar, onCambios }: Props) {
  const [modo, setModo] = useState<"ver" | "cambios">("ver");
  const [cambiosMap, setCambiosMap] = useState<Record<string, string>>({});
  const r = v.req;
  const limpio = Object.fromEntries(
    Object.entries(cambiosMap).map(([k, a]) => [k, a.trim()]).filter(([, a]) => a),
  );
  const nSol = Object.keys(limpio).length;

  const Row = ({ l, c, k }: { l: string; c: ReactNode; k?: string }) => (
    <div style={{ marginBottom: 10 }} key={l}>
      <label>
        {l}
        {modo === "cambios" && k && cambiosMap[k] === undefined && (
          <button type="button" className="lapiz" title={"Solicitar cambio en: " + l}
            onClick={() => setCambiosMap((m) => ({ ...m, [k]: "" }))}><Edit3 size={12} /></button>
        )}
      </label>
      <div style={{ fontSize: 13.5 }}>{c}</div>
      {modo === "cambios" && k && cambiosMap[k] !== undefined && (
        <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
          <input autoFocus placeholder="Describe el ajuste que necesitas en este campo…" style={{ flex: 1 }}
            value={cambiosMap[k]} onChange={(e) => setCambiosMap((m) => ({ ...m, [k]: e.target.value }))} />
          <button type="button" className="lapiz on" title="Quitar esta anotación"
            onClick={() => setCambiosMap((m) => { const n = { ...m }; delete n[k]; return n; })}><X size={12} /></button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {v.estado === "asignada" && modo === "ver" && (
        <div className="aibox" style={{ marginBottom: 16 }}>
          <div className="hd"><Sparkles size={15} /> Descriptivo precargado — requiere tu aprobación</div>
          <p style={{ fontSize: 13, color: "var(--ink2)" }}>El sistema precargó salario, funciones y atributos desde la estructura organizacional (HCM/TGS · simulado). Revisa el descriptivo: puedes <b>aprobarlo</b> para iniciar la búsqueda o <b>solicitar cambios</b> al administrador.</p>
        </div>
      )}
      {modo === "cambios" && (
        <div className="card" style={{ background: "var(--gold-soft)", borderColor: "#F0D9A5", marginBottom: 16 }}>
          <b style={{ fontSize: 13.5 }}><Edit3 size={14} style={{ verticalAlign: -2 }} /> Solicitud de cambios por campo</b>
          <p style={{ fontSize: 13, marginTop: 6 }}>Usa el lápiz junto a cada campo para abrir su anotación; puedes anotar <b>tantos campos como necesites</b>. Al terminar, envía todas las solicitudes juntas a revisión del administrador.</p>
          <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn dark sm" disabled={nSol === 0} onClick={() => { onCambios(limpio); setModo("ver"); setCambiosMap({}); }}><Send size={13} /> Enviar a revisión ({nSol} campo{nSol === 1 ? "" : "s"})</button>
            <button className="btn ghost sm" onClick={() => { setModo("ver"); setCambiosMap({}); }}>Cancelar</button>
            {nSol === 0 && <span className="help">Anota al menos un campo para poder enviar.</span>}
          </div>
        </div>
      )}
      {v.estado === "cambios" && (
        <div className="card" style={{ background: "var(--gold-soft)", borderColor: "#F0D9A5", marginBottom: 16 }}>
          <b style={{ fontSize: 13.5 }}><Clock size={14} style={{ verticalAlign: -2 }} /> Cambios solicitados al administrador</b>
          <CambiosResumen cambios={v.cambios} />
          <p className="help">Recibirás una notificación cuando el descriptivo esté actualizado.</p>
        </div>
      )}

      <div className="grid2">
        <div>
          {Row({ l: "Puesto", k: "titulo", c: <b>{r.titulo}</b> })}
          {Row({ l: "Descripción", k: "descripcion", c: r.descripcion })}
          {Row({ l: "Especialidades requeridas", k: "espRequeridas", c: <div className="tagpick">{r.espRequeridas.map((e) => <span key={e} className="chip gold">{e}</span>)}</div> })}
          {r.espOpcionales.length > 0 && Row({ l: "Especialidades opcionales", k: "espOpcionales", c: <div className="tagpick">{r.espOpcionales.map((e) => <span key={e} className="chip">{e}</span>)}</div> })}
          {Row({ l: "Habilidades técnicas", k: "hardSkills", c: <div className="tagpick">{r.hardSkills.map((e) => <span key={e} className="chip">{e}</span>)}</div> })}
          {Row({ l: "Habilidades blandas", k: "softSkills", c: <div className="tagpick">{r.softSkills.map((e) => <span key={e} className="chip">{e}</span>)}</div> })}
          {r.aptitudes.length > 0 && Row({ l: "Aptitudes a evaluar", k: "aptitudes", c: <div className="tagpick">{r.aptitudes.map((e) => <span key={e} className="chip">{e}</span>)}</div> })}
        </div>
        <div>
          <div className="grid2">
            {Row({ l: "Área", k: "area", c: r.area })}{Row({ l: "Nivel", k: "nivelPuesto", c: r.nivelPuesto })}
            {Row({ l: "Experiencia mínima", k: "anosExp", c: r.expNoRelevante ? "No relevante" : r.anosExp + " años" })}{Row({ l: "Estudios", k: "educacion", c: r.educacion + (r.puedeSerSuperior ? " o superior" : "") })}
            {Row({ l: "Ubicación del trabajo", k: "ubicacionTrabajo", c: r.ubicacionTrabajo })}{Row({ l: "Modalidad", k: "modalidad", c: r.modalidad })}
            {Row({ l: "Horario", k: "horario", c: r.horario })}{Row({ l: "Días", k: "dias", c: r.dias.join(", ") })}
            {Row({ l: "Rango salarial", k: "salario", c: money(r.salarioMin) + " – " + money(r.salarioMax) })}{Row({ l: "Posiciones", k: "numVacantes", c: r.numVacantes })}
            {Row({ l: "Búsqueda de candidatos", k: "radio", c: r.ubicacionNoRelevante ? "Ubicación no relevante (sin restricción)" : `${r.ubicacionCandidato} · radio ${r.radioKm} km` })}
            {Row({ l: "Edad preferida", k: "edad", c: r.edadNoRelevante ? "No relevante" : `${r.edadMin} – ${r.edadMax} años` })}
            {r.sede && Row({ l: "Sede", k: "sede", c: `${r.tipoSede} · ${r.sede}` })}
            {r.unidadNegocio && Row({ l: "Unidad de Negocio", k: "unidadNegocio", c: r.unidadNegocio })}
            {Row({ l: "Tipo de vacante", k: "tipoVacante", c: r.tipoVacante === "Confidencial" ? <Chip tone="gold" icon={ShieldCheck}>Confidencial</Chip> : (r.tipoVacante || "Estándar") })}
            {r.examenMedico && Row({ l: "Examen médico", k: "examenMedico", c: <Chip tone="gold" icon={ShieldCheck}>Requerido al candidato seleccionado</Chip> })}
          </div>
          {r.killer.length > 0 && Row({ l: "Preguntas filtro (killer questions)", k: "killer", c: r.killer.map((q, i) => <div key={i} style={{ fontSize: 13, marginTop: 4 }}>• {q.q}</div>) })}
          {Row({ l: "Historial", c: v.historial.map((h, i) => <div key={i} className="help">• {h}</div>) })}
        </div>
      </div>

      {v.estado === "asignada" && modo === "ver" && (
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn gold" onClick={onAprobar}><CheckCircle2 size={16} /> Aprobar e iniciar búsqueda</button>
          <button className="btn ghost" onClick={() => setModo("cambios")}><Edit3 size={15} /> Solicitar cambios</button>
        </div>
      )}
    </div>
  );
}
