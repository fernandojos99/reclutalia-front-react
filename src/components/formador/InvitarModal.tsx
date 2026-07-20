/** Modal para invitar a un candidato a postularse (portado del `InvitarModal`). */
import { useState } from "react";
import { Send } from "lucide-react";
import { Modal } from "../common/Modal";
import type { Candidato, Vacante } from "../../types/models/domain";

interface Props {
  cand: Candidato;
  v: Vacante;
  onSend: (msg: string) => void;
  onClose: () => void;
}

export function InvitarModal({ cand, v, onSend, onClose }: Props) {
  const def = `Hola ${cand.nombre.split(" ")[0]}, revisé tu perfil y creo que encaja muy bien con la vacante "${v.req.titulo}" (${v.req.modalidad}, ${v.req.ubicacionTrabajo}). Me encantaría invitarte a postularte. ¡Saludos!`;
  const [tipo, setTipo] = useState<"default" | "custom">("default");
  const [msg, setMsg] = useState(def);
  return (
    <Modal onClose={onClose}>
      <h3 style={{ marginBottom: 4 }}>Invitar a postularse</h3>
      <p className="help" style={{ marginBottom: 14 }}>{cand.nombre} recibirá una notificación con tu mensaje (y por correo/WhatsApp en la versión final).</p>
      <div className="tagpick" style={{ marginBottom: 12 }}>
        <button className={"tag" + (tipo === "default" ? " on" : "")} onClick={() => { setTipo("default"); setMsg(def); }}>Mensaje predefinido</button>
        <button className={"tag" + (tipo === "custom" ? " on" : "")} onClick={() => setTipo("custom")}>Personalizar mensaje</button>
      </div>
      <textarea rows={5} value={msg} onChange={(e) => { setMsg(e.target.value); setTipo("custom"); }} />
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button className="btn gold" onClick={() => onSend(msg)}><Send size={15} /> Enviar invitación</button>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}
