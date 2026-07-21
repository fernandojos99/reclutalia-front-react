/**
 * Ficha de candidato generada por IA (rediseño Batch 4): score, viabilidad, resumen, habilidades
 * con barras, fortalezas/áreas de mejora y resumen antifraude. Todo DETERMINISTA por candidato
 * (números derivados de id/match; sin azar) — simulado.
 */
import { Download, CheckCircle2 } from "lucide-react";
import { Modal } from "../common/Modal";
import { Avatar } from "../common/Avatar";
import { Chip } from "../common/Chip";
import { descargarCV } from "../../utils/descargarCV";
import type { Candidato, Vacante } from "../../types/models/domain";

interface Props {
  cand: Candidato;
  v: Vacante;
  /** Score IA del pipeline (matchIA || match). */
  match?: number;
  onClose: () => void;
}

const Label = ({ t }: { t: string }) => (
  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em", color: "var(--gray)", textTransform: "uppercase", margin: "16px 0 8px" }}>{t}</div>
);

const SkillBar = ({ nombre, valor }: { nombre: string; valor: number }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
      <span style={{ fontWeight: 600 }}>{nombre}</span><b style={{ color: "var(--gold-dark)" }}>{valor}</b>
    </div>
    <div className="skillbar"><i style={{ width: `${valor}%` }} /></div>
  </div>
);

export function VideoIAResumenModal({ cand, v, match, onClose }: Props) {
  const nombre = cand.nombre.split(" ")[0];
  const score = match ?? 80;
  const alta = score >= 80;
  // Valores deterministas 60–98 derivados de id + índice (sin azar).
  const val = (i: number) => Math.max(60, Math.min(98, score - ((cand.id * 7 + i * 13) % 17) + 4));
  const tec = (cand.hard.length ? cand.hard : ["Herramientas del puesto"]).slice(0, 3);
  const bla = (cand.soft.length ? cand.soft : ["Comunicación efectiva"]).slice(0, 3);
  const fortalezas = [
    `${cand.exp} años de experiencia comprobable en ${cand.esp[0] || cand.area}.`,
    `Dominio de ${tec.slice(0, 2).join(" y ")} alineado con el descriptivo.`,
    `Respuestas con ejemplos medibles y actitud orientada a resultados.`,
  ];
  const mejoras = [
    `Profundizar experiencia específica en ${v.req.espRequeridas[0] || v.req.area}.`,
    `Confirmar disponibilidad plena para el esquema ${v.req.modalidad.toLowerCase()} y el ${(v.req.turno || "turno mixto").toLowerCase()}.`,
  ];
  const antifraude = [
    "Identidad verificada por biometría facial",
    "Sin suplantación durante la video-entrevista",
    "Cambios de ventana durante la prueba: 0",
    "Consistencia de respuestas cuestionario vs. entrevista",
  ];

  return (
    <Modal onClose={onClose} wide>
      {/* Header */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 10, paddingRight: 28 }}>
        <Avatar nombre={cand.nombre} foto={cand.foto} />
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 17 }}>{cand.nombre}</h3>
            <Chip tone={cand.tipo === "interno" ? "gold" : ""}>{cand.tipo === "interno" ? "Interno" : "Externo"}</Chip>
          </div>
          <div className="help">Ficha de candidato · generada por IA</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: "var(--gold-dark)", lineHeight: 1 }}>{score}%</div>
          <div className="help">score IA · etapa actual</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
        <span className="chip ok"><CheckCircle2 size={12} /> Viabilidad: {alta ? "Alta" : "Media"}</span>
        <button className="btn ghost sm" onClick={() => descargarCV(cand)}><Download size={13} /> Descargar PDF</button>
      </div>
      <p style={{ fontSize: 13.5, fontWeight: 600 }}>
        {alta ? "Viable para entrevista" : "Viable con reservas"}; perfil fuerte en {cand.esp[0] || cand.area}.
      </p>

      <Label t="Resumen general" />
      <p style={{ fontSize: 13, lineHeight: 1.6 }}>
        {nombre} completó la video-entrevista automatizada y los filtros iniciales. Sustentó {cand.exp} años de
        experiencia como {cand.puesto.toLowerCase()} con dominio de {tec.slice(0, 2).join(" y ")}. Comunicación clara,
        ejemplos concretos y expectativas alineadas con la vacante «{v.req.titulo}».
      </p>

      <div className="grid2" style={{ marginTop: 4 }}>
        <div>
          <Label t="Habilidades técnicas" />
          {tec.map((h, i) => <SkillBar key={h} nombre={h} valor={val(i)} />)}
        </div>
        <div>
          <Label t="Habilidades blandas" />
          {bla.map((h, i) => <SkillBar key={h} nombre={h} valor={val(i + 3)} />)}
        </div>
      </div>

      <Label t="Fortalezas" />
      {fortalezas.map((f, i) => <div key={i} style={{ fontSize: 13, marginTop: 4 }}>• {f}</div>)}
      <Label t="Áreas de mejora" />
      {mejoras.map((f, i) => <div key={i} style={{ fontSize: 13, marginTop: 4 }}>• {f}</div>)}

      <Label t="Resumen antifraude · aplicación de la prueba" />
      {antifraude.map((a) => (
        <div key={a} className="check-item" style={{ marginTop: 6 }}>
          <span style={{ flex: 1, fontSize: 13 }}>{a}</span>
          <span className="chip ok"><CheckCircle2 size={11} /> Verificado</span>
        </div>
      ))}

      <div className="help" style={{ marginTop: 14, lineHeight: 1.5 }}>
        Generado por IA a partir del cuestionario de skills, la video-entrevista y los filtros automáticos.
        Apoya la decisión del formador; no la sustituye.
      </div>
    </Modal>
  );
}
