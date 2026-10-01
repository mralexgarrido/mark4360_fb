import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
export default function PracticeDialog({ title, onClose, children, footer }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    element.showModal();
    return () => { element.close(); previousFocus?.focus(); };
  }, []);
  return createPortal(<dialog ref={dialog} className="practice-dialog" aria-labelledby="practice-dialog-title" onCancel={onClose}><div className="dialog-header"><h2 id="practice-dialog-title">{title}</h2><button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={22}/></button></div><div className="dialog-body">{children}</div><div className="dialog-footer">{footer || <button type="button" className="button secondary" onClick={onClose}>Close preview</button>}</div></dialog>,document.body);
}
