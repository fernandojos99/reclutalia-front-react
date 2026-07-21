/** Genera y descarga un CV en HTML (demo, cliente) — portado de `descargarCV` del App original. */
import type { Candidato } from "../types/models/domain";

export function descargarCV(c: Candidato): void {
  const html = `<!doctype html><html lang="es"><meta charset="utf-8"><title>CV ${c.nombre}</title>
  <body style="font-family:Segoe UI,Arial,sans-serif;max-width:720px;margin:40px auto;color:#1A1A1A">
  <div style="border-bottom:4px solid #FFB81C;padding-bottom:12px"><h1 style="margin:0">${c.nombre}</h1>
  <p style="margin:4px 0;color:#555">${c.puesto} · ${c.nivel} · ${c.ciudad} · ${c.email} · ${c.tel}</p></div>
  <h3>Resumen profesional</h3><p>${c.resumen}</p>
  <h3>Especialidades</h3><p>${c.esp.join(" · ")}</p>
  <h3>Habilidades técnicas</h3><p>${c.hard.join(" · ")}</p>
  <h3>Habilidades blandas</h3><p>${c.soft.join(" · ")}</p>
  <h3>Formación</h3><p>${String(c.edu ?? "")} · ${String(c.exp ?? "")} años de experiencia</p>
  <p style="margin-top:30px;font-size:11px;color:#999">Documento generado por Radar de candidatos (prototipo demo).</p></body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `CV_${c.nombre.replace(/ /g, "_")}.html`;
  a.click();
  URL.revokeObjectURL(a.href);
}
