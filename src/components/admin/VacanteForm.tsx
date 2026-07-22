/** Wizard de 3 pasos para el descriptivo de la vacante (sin preguntas filtro desde el rediseño). */
import { useState, type ReactNode } from "react";
import { AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import { TagPicker } from "../ui/uploads";
import { crearRequisito } from "../../utils/requisito";
import {
  AREAS, CIUDADES, EDUCACION, TIPOS_SEDE, SEDES, TIPOS_VACANTE,
  ESPECIALIDADES, PROFESIONES, TURNOS, HARD_SKILLS, SOFT_SKILLS, APTITUDES, MODALIDADES, DIAS,
} from "../../constants/catalogos";
import type { Cambios, Requisito } from "../../types/models/domain";

interface Props {
  inicial?: Requisito;
  onSave: (req: Requisito, rechazados: string[]) => void;
  saveLabel?: string;
  extraTop?: ReactNode;
  cambios?: Cambios;
}

const SECS = ["1 · El puesto", "2 · Perfil del candidato", "3 · Condiciones"];

export function VacanteForm({ inicial, onSave, saveLabel = "Guardar vacante", extraTop, cambios }: Props) {
  const [r, setR] = useState<Requisito>(inicial || crearRequisito());
  const [sec, setSec] = useState(0);
  const [rechazados, setRechazados] = useState<string[]>([]);
  const set = <K extends keyof Requisito>(k: K, v: Requisito[K]) => setR((x) => ({ ...x, [k]: v }));

  const porCampo = cambios && typeof cambios === "object" ? cambios : null;
  const Anot = ({ k }: { k: string }) => {
    if (!porCampo || !porCampo[k]) return null;
    const rej = rechazados.includes(k);
    return (
      <div className={"anot" + (rej ? " rej" : "")}>
        <AlertCircle size={13} />
        <span style={{ flex: 1 }}><b>Cambio solicitado:</b> {porCampo[k]}{rej && <b> · Rechazado</b>}</span>
        <button type="button" className="btn ghost sm" onClick={() => setRechazados((x) => (rej ? x.filter((y) => y !== k) : [...x, k]))}>{rej ? "Reconsiderar" : "Rechazar cambio"}</button>
      </div>
    );
  };

  const valido = r.titulo.trim() && r.descripcion.trim() && r.espRequeridas.length > 0 && r.hardSkills.length > 0;
  const faltanSec = (s: number): string[] => {
    const f: string[] = [];
    if (s === 0) {
      if (!r.titulo.trim()) f.push("título del puesto");
      if (!r.descripcion.trim()) f.push("descripción");
      if (!r.sede) f.push("sede");
      if (!r.unidadNegocio.trim()) f.push("unidad de negocio");
    }
    if (s === 1) {
      if (!r.espRequeridas.length) f.push("especialidades");
      if (!r.hardSkills.length) f.push("habilidades técnicas");
      if (!r.edadNoRelevante && !(r.edadMin >= 18 && r.edadMax >= r.edadMin)) f.push('rango de edad válido (o marca "Edad no relevante")');
    }
    if (s === 2) {
      if (!r.horario.trim()) f.push("horario");
      if (!r.dias.length) f.push("días de trabajo");
      if (!(r.salarioMin > 0 && r.salarioMax >= r.salarioMin)) f.push("rango salarial válido");
    }
    return f;
  };
  const faltan = faltanSec(sec);
  const faltanTodas = [0, 1, 2].flatMap(faltanSec);

  return (
    <div>
      {extraTop}
      {cambios && typeof cambios === "string" && (
        <div className="anot" style={{ marginBottom: 14 }}><AlertCircle size={13} /><span style={{ flex: 1 }}><b>El formador solicitó:</b> "{cambios}"</span></div>
      )}
      {porCampo && (
        <div className="anot" style={{ marginBottom: 14 }}><AlertCircle size={13} /><span style={{ flex: 1 }}>El formador solicitó cambios en <b>{Object.keys(porCampo).length} campo(s)</b> (resaltados en cada sección). Aplica el cambio editando el campo o márcalo como rechazado.</span></div>
      )}
      <div className="tabs">{SECS.map((s, i) => <button key={i} className={"tab" + (sec === i ? " on" : "")} onClick={() => setSec(i)}>{s}</button>)}</div>

      {sec === 0 && (
        <div>
          <div className="grid2">
            <div className="field"><label>Título del puesto *</label><input value={r.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="p. ej. Ejecutivo de Ventas Digitales" /><Anot k="titulo" /></div>
            <div className="field"><label>Área</label><select value={r.area} onChange={(e) => set("area", e.target.value)}>{AREAS.map((a) => <option key={a}>{a}</option>)}</select><Anot k="area" /></div>
          </div>
          <div className="field"><label>Descripción del puesto *</label>
            <textarea rows={4} value={r.descripcion} onChange={(e) => set("descripcion", e.target.value)} placeholder="Responsabilidades, objetivos y contexto del equipo…" /><Anot k="descripcion" /></div>
          <div className="grid2">
            <div className="field"><label>Número de posiciones</label><input type="number" min="1" value={r.numVacantes} onChange={(e) => set("numVacantes", +e.target.value)} /><Anot k="numVacantes" /></div>
            <div className="field"><label>Ubicación del trabajo</label><select value={r.ubicacionTrabajo} onChange={(e) => set("ubicacionTrabajo", e.target.value)}>{CIUDADES.map((a) => <option key={a}>{a}</option>)}</select><Anot k="ubicacionTrabajo" /></div>
          </div>
          <div className="grid3">
            <div className="field"><label>Tipo de sede *</label>
              <select value={r.tipoSede} onChange={(e) => setR((x) => ({ ...x, tipoSede: e.target.value, sede: "" }))}>{TIPOS_SEDE.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div className="field"><label>Sede *</label>
              <select value={r.sede} onChange={(e) => set("sede", e.target.value)}>
                <option value="">Selecciona la sede…</option>
                {(SEDES[r.tipoSede] ?? []).map((s) => <option key={s}>{s}</option>)}
              </select><Anot k="sede" /></div>
            <div className="field"><label>Unidad de Negocio *</label><input value={r.unidadNegocio} onChange={(e) => set("unidadNegocio", e.target.value)} placeholder="p. ej. Banca Digital, Retail Centro…" /><Anot k="unidadNegocio" /></div>
          </div>
          <div className="field"><label>Tipo de vacante</label>
            <div className="tagpick">{TIPOS_VACANTE.map((t) => <button type="button" key={t} className={"tag" + (r.tipoVacante === t ? " on" : "")} onClick={() => set("tipoVacante", t)}>{t}</button>)}</div>
            {r.tipoVacante === "Confidencial" && <div className="help">Se mostrará con un chip "Confidencial" al administrador y al formador. No aparecerá en "Buscar vacantes" del candidato.</div>}
            <Anot k="tipoVacante" />
          </div>
        </div>
      )}

      {sec === 1 && (
        <div>
          <div className="grid3">
            <div className="field"><label>Años de experiencia mínimos</label>
              <input type="number" min="0" value={r.anosExp} onChange={(e) => set("anosExp", +e.target.value)} disabled={r.expNoRelevante} />
              <label className="chk-inline"><input type="checkbox" checked={r.expNoRelevante} onChange={(e) => set("expNoRelevante", e.target.checked)} /> No relevante</label>
              <Anot k="anosExp" />
            </div>
            <div className="field"><label>Nivel de estudios</label>
              <select value={r.educacion} onChange={(e) => set("educacion", e.target.value)}>{EDUCACION.map((a) => <option key={a}>{a}</option>)}</select>
              <label className="chk-inline"><input type="checkbox" checked={r.puedeSerSuperior} onChange={(e) => set("puedeSerSuperior", e.target.checked)} /> Puede ser superior</label>
              <Anot k="educacion" />
            </div>
            <div className="field"><label>Radio de búsqueda del candidato</label>
              <div style={{ display: "flex", gap: 8 }}>
                <select value={r.ubicacionCandidato} onChange={(e) => set("ubicacionCandidato", e.target.value)} style={{ flex: 1 }} disabled={r.ubicacionNoRelevante}>{CIUDADES.map((a) => <option key={a}>{a}</option>)}</select>
                <select value={r.radioKm} onChange={(e) => set("radioKm", +e.target.value)} style={{ width: 110 }} disabled={r.ubicacionNoRelevante}>{[10, 25, 30, 40, 50, 100, 300].map((k) => <option key={k} value={k}>{k} km</option>)}</select>
              </div>
              <label className="chk-inline"><input type="checkbox" checked={r.ubicacionNoRelevante} onChange={(e) => set("ubicacionNoRelevante", e.target.checked)} /> Ubicación no relevante</label>
              <div className="help">{r.ubicacionNoRelevante ? "La IA no restringirá por ubicación: todos los candidatos reciben el puntaje completo de distancia." : "La IA prioriza candidatos dentro de este radio."}</div>
              <Anot k="radio" />
            </div>
          </div>
          <div className="field" style={{ maxWidth: 420 }}><label>Rango de edad preferida</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="number" min="18" max="99" value={r.edadMin} onChange={(e) => set("edadMin", +e.target.value)} disabled={r.edadNoRelevante} /><span>a</span>
              <input type="number" min="18" max="99" value={r.edadMax} onChange={(e) => set("edadMax", +e.target.value)} disabled={r.edadNoRelevante} /><span>años</span>
            </div>
            <label className="chk-inline"><input type="checkbox" checked={r.edadNoRelevante} onChange={(e) => set("edadNoRelevante", e.target.checked)} /> Edad no relevante</label>
            <div className="help">Referencia para el equipo de reclutamiento; la edad NO afecta el ranking de compatibilidad de la IA.</div>
            <Anot k="edad" />
          </div>
          <div className="field"><label>Área de conocimiento <span style={{ fontWeight: 400, color: "var(--gray)" }}>(máx. 3)</span></label>
            <TagPicker options={PROFESIONES} value={r.areasConocimiento} onChange={(v) => v.length <= 3 && set("areasConocimiento", v)} /><Anot k="areasConocimiento" /></div>
          <div className="field"><label>Especialidades * <span style={{ fontWeight: 400, color: "var(--gray)" }}>(máx. 5)</span></label>
            <TagPicker options={ESPECIALIDADES} value={r.espRequeridas} onChange={(v) => v.length <= 5 && set("espRequeridas", v)} addNew /><Anot k="espRequeridas" /></div>
          <div className="field"><label>Habilidades duras / técnicas requeridas *</label>
            <TagPicker options={HARD_SKILLS} value={r.hardSkills} onChange={(v) => set("hardSkills", v)} addNew /><Anot k="hardSkills" /></div>
          <div className="field"><label>Habilidades blandas requeridas</label>
            <TagPicker options={SOFT_SKILLS} value={r.softSkills} onChange={(v) => set("softSkills", v)} addNew /><Anot k="softSkills" /></div>
          <div className="field"><label>Aptitudes a evaluar</label>
            <TagPicker options={APTITUDES} value={r.aptitudes} onChange={(v) => set("aptitudes", v)} addNew /><Anot k="aptitudes" /></div>
        </div>
      )}

      {sec === 2 && (
        <div>
          <div className="grid2">
            <div className="field"><label>Modalidad de trabajo</label>
              <div className="tagpick">{MODALIDADES.map((m) => <button type="button" key={m} className={"tag" + (r.modalidad === m ? " on" : "")} onClick={() => set("modalidad", m)}>{m}</button>)}</div><Anot k="modalidad" /></div>
            <div className="field"><label>Días de trabajo</label><TagPicker options={DIAS} value={r.dias} onChange={(v) => set("dias", v)} /><Anot k="dias" /></div>
            <div className="field"><label>Turno</label>
              <div className="tagpick">{TURNOS.map((t) => <button type="button" key={t} className={"tag" + (r.turno === t ? " on" : "")} onClick={() => set("turno", t)}>{t}</button>)}</div><Anot k="turno" /></div>
            <div className="field"><label>Horario</label><input value={r.horario} onChange={(e) => set("horario", e.target.value)} placeholder="p. ej. 9:00 – 18:00" /><Anot k="horario" /></div>
            <div className="field"><label>Rango salarial mensual bruto</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="number" value={r.salarioMin} onChange={(e) => set("salarioMin", +e.target.value)} /><span>a</span>
                <input type="number" value={r.salarioMax} onChange={(e) => set("salarioMax", +e.target.value)} />
              </div>
              <div className="help">Rango autorizado por Compensaciones (tabulador precargado · simulado).</div>
              <Anot k="salario" />
            </div>
          </div>
          <div className="field" style={{ marginTop: 4 }}>
            <label>Examen médico</label>
            <label className="check-item" style={{ cursor: "pointer", fontWeight: 400, alignItems: "flex-start" }}>
              <input type="checkbox" style={{ width: "auto", marginTop: 2, marginRight: 8 }} checked={!!r.examenMedico} onChange={(e) => set("examenMedico", e.target.checked)} />
              <span style={{ flex: 1, fontSize: 13, lineHeight: 1.5 }}>¿Esta vacante requiere examen médico al candidato seleccionado?</span>
            </label>
            <div className="help">Si se activa, el candidato seleccionado deberá agendar y aprobar un examen médico antes de completar su documentación.</div>
            <Anot k="examenMedico" />
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 18, alignItems: "center", flexWrap: "wrap" }}>
        {sec > 0 && <button className="btn ghost" onClick={() => setSec(sec - 1)}>Anterior</button>}
        {sec < 2 && <button className="btn dark" disabled={faltan.length > 0} onClick={() => setSec(sec + 1)}>Siguiente <ChevronRight size={15} /></button>}
        {sec === 2 && <button className="btn gold" disabled={!valido || faltanTodas.length > 0} onClick={() => onSave(r, rechazados)}><CheckCircle2 size={15} /> {saveLabel}</button>}
        {faltan.length > 0 && <span className="help" style={{ color: "var(--bad)" }}><AlertCircle size={12} style={{ verticalAlign: -2 }} /> Para continuar completa: {faltan.join(", ")}.</span>}
        {sec === 2 && faltan.length === 0 && faltanTodas.length > 0 && <span className="help" style={{ color: "var(--bad)" }}><AlertCircle size={12} style={{ verticalAlign: -2 }} /> Faltan campos en otras secciones: {[...new Set(faltanTodas)].join(", ")}.</span>}
      </div>
    </div>
  );
}
