/** Modal base con overlay y botón de cierre (portado del `Modal` base). */
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export function Modal({ onClose, children, wide }: ModalProps) {
  return (
    <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={"modal" + (wide ? " wide" : "")}>
        <button className="xclose" onClick={onClose}><X size={16} /></button>
        {children}
      </div>
    </div>
  );
}
