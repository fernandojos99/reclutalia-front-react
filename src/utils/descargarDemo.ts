/**
 * Descarga SIMULADA para la demo: cualquier archivo referenciado en el chat (CV, foto, video,
 * documentos del candidato…) se "descarga" como un .html placeholder que dice "Demo de archivo".
 * Aparenta ser un documento/PDF pero es un HTML de demostración (no hay archivos reales que servir).
 */
export function descargarDemo(nombre: string): void {
  const limpio = (nombre || "Archivo").trim();
  const html = `<!doctype html><html lang="es"><meta charset="utf-8"><title>${limpio} — Demo</title>
  <body style="font-family:Segoe UI,Arial,sans-serif;max-width:640px;margin:60px auto;color:#1A1A1A;text-align:center">
  <div style="border:2px dashed #FFB81C;border-radius:16px;padding:48px 32px">
    <div style="font-size:46px">📄</div>
    <h1 style="margin:10px 0 4px">Demo de archivo</h1>
    <p style="font-size:16px;color:#555;margin:0">${limpio}</p>
    <p style="margin-top:22px;font-size:12px;color:#999">Archivo de demostración generado por Radar de Candidatos (prototipo). En producción aquí se descargaría el documento real.</p>
  </div></body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${limpio.replace(/[^\w-]+/g, "_").slice(0, 60) || "archivo"}.html`;
  a.click();
  URL.revokeObjectURL(a.href);
}
