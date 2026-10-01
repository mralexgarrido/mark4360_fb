import { useRef, useState } from 'react';
import { Upload, Image, X } from 'lucide-react';
import { MAX_IMAGE_BYTES, isImageSource } from '../lib/campaign';
import InfoIcon from './InfoIcon';
const types = ['image/png','image/jpeg','image/webp','image/gif'];
export default function MediaInput({ value, name = '', alt = '', id = 'imageUrl', onChange, error }) {
  const [mode, setMode] = useState(value && !value.startsWith('data:') ? 'url' : 'upload');
  const [fileError, setFileError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const readSequence = useRef(0);
  const readFile = file => {
    if (!file) return;
    if (!types.includes(file.type)) { setFileError('Choose a PNG, JPG, WEBP, or GIF image.'); return; }
    if (file.size > MAX_IMAGE_BYTES) { setFileError('Choose an image no larger than 10 MB.'); return; }
    setFileError(''); setLoading(true);
    const sequence = ++readSequence.current;
    const reader = new FileReader();
    reader.onerror = () => { if (sequence === readSequence.current) { setLoading(false); setFileError('This image could not be read. Choose another file.'); } };
    reader.onload = () => { if (sequence === readSequence.current) { setLoading(false); onChange({ imageUrl: reader.result, imageName: file.name, imageAlt: alt }); } };
    reader.readAsDataURL(file);
  };
  return <div className="media-input" id={`${id}-field`} tabIndex={-1}><div className="field-label"><label htmlFor={mode === 'upload' ? `${id}-upload` : id}>Ad media</label><InfoIcon contentKey="imageUrl"/></div><div className="segmented" aria-label="Media source"><button type="button" aria-pressed={mode === 'upload'} onClick={() => setMode('upload')}>Upload image</button><button type="button" aria-pressed={mode === 'url'} onClick={() => setMode('url')}>Image URL</button></div>
    {mode === 'upload' ? <div className={`upload-zone ${dragging ? 'dragging' : ''}`} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); readFile(e.dataTransfer.files[0]); }}><Upload size={24}/><label htmlFor={`${id}-upload`}>Choose an image or drag it here</label><input id={`${id}-upload`} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e => { readFile(e.target.files[0]); e.target.value = ''; }}/><small>PNG, JPG, WEBP, or GIF. Maximum 10 MB.</small></div> : <><input id={id} type="url" value={value.startsWith('data:') ? '' : value} onChange={e => onChange({ imageUrl: e.target.value, imageName: '', imageAlt: alt })} placeholder="https://example.com/your-image.jpg" aria-label="Image URL"/><p className="field-hint">External URLs request images from their provider. Upload to keep the asset in your draft.</p></>}
    {loading && <p role="status">Reading image…</p>}{value && isImageSource(value) && <div className="media-attached"><Image size={16}/><span>{name || 'Image attached'}</span><button type="button" className="icon-button" aria-label="Remove image" onClick={() => { ++readSequence.current; setLoading(false); onChange({imageUrl:'',imageName:'',imageAlt:''}); }}><X size={16}/></button></div>}
    {(fileError || error) && <p className="field-error" role="alert">{fileError || error}</p>}
    <div className="field"><label htmlFor={`${id}-alt`}>Image description <span className="optional">(optional)</span></label><input id={`${id}-alt`} value={alt} onChange={e => onChange({ imageUrl:value,imageName:name,imageAlt:e.target.value })} placeholder="Describe the visual for someone who cannot see it."/></div>
  </div>;
}
