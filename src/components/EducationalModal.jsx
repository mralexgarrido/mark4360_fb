import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
export default function EducationalModal({ onClose, title, content }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    element.showModal();
    return () => { element.close(); previousFocus?.focus(); };
  }, []);
  return createPortal(<dialog ref={dialog} className="learning-dialog" aria-labelledby="learning-title" onCancel={onClose} onClick={e => { if (e.target === dialog.current) { const bounds = dialog.current.getBoundingClientRect(); if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) onClose(); } }}>
    <div className="dialog-header"><div><span className="eyebrow">Learning window</span><h2 id="learning-title">{title}</h2></div><button type="button" className="icon-button" aria-label="Close learning window" onClick={onClose}><X size={22}/></button></div>
    <div className="dialog-body">{typeof content === 'string' ? <p className="preserve-lines">{content}</p> : <><h3>What this controls</h3><p>{content.what}</p><h3>Think through your choice</h3><p>{content.consider}</p><h3>In Ads Manager</h3><p>{content.platform}</p>{content.prompt && <div className="learning-prompt"><strong>For your explanation</strong><p>{content.prompt}</p></div>}</>}</div>
    <div className="dialog-footer"><button type="button" className="button primary" onClick={onClose}>Return to my campaign</button></div>
  </dialog>, document.body);
}
