import InfoIcon from './InfoIcon';
export function Field({ id, label, help, hint, error, children, optional = false }) {
  return <div className="field" id={`${id}-field`} tabIndex={-1}>
    <div className="field-label"><label htmlFor={id}>{label} {optional && <span className="optional">(optional)</span>}</label>{help && <InfoIcon contentKey={help}/>}</div>
    {children}
    {hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
    {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
  </div>;
}
export function Input({ data, update, name, label, help, hint, error, type = 'text', optional, ...props }) {
  return <Field id={name} label={label} help={help} hint={hint} error={error} optional={optional}><input id={name} type={type} maxLength={24000} value={data[name]} onChange={e => update(name,e.target.value)} onInput={['date','time'].includes(type) ? e => update(name,e.target.value) : undefined} aria-invalid={!!error} aria-describedby={[hint && `${name}-hint`,error && `${name}-error`].filter(Boolean).join(' ') || undefined} {...props}/></Field>;
}
export function Textarea({ data, update, name, label, help, hint, error, optional, rows = 3, ...props }) {
  return <Field id={name} label={label} help={help} hint={hint} error={error} optional={optional}><textarea id={name} value={data[name]} onChange={e => update(name,e.target.value)} rows={rows} maxLength={24000} aria-invalid={!!error} aria-describedby={[hint && `${name}-hint`,error && `${name}-error`].filter(Boolean).join(' ') || undefined} {...props}/></Field>;
}
export function Select({ data, update, name, label, help, hint, error, options, ...props }) {
  return <Field id={name} label={label} help={help} hint={hint} error={error}><select id={name} value={data[name]} onChange={e => update(name,e.target.value)} aria-invalid={!!error} aria-describedby={[hint && `${name}-hint`,error && `${name}-error`].filter(Boolean).join(' ') || undefined} {...props}>{options.map(option => <option key={typeof option === 'string' ? option : option.value} value={typeof option === 'string' ? option : option.value}>{typeof option === 'string' ? option : option.label}</option>)}</select></Field>;
}
export function Section({ title, help, description, children }) {
  return <section className="form-section"><div className="section-heading"><h3>{title}</h3>{help && <InfoIcon contentKey={help}/>}</div>{description && <p className="section-description">{description}</p>}{children}</section>;
}
export function ErrorList({ errors, onSelect }) {
  if (!errors.length) return null;
  return <div className="error-summary" role="alert" tabIndex={-1}><h3>Complete these setup requirements</h3><ul>{errors.map((error,index) => <li key={`${error.field}-${index}`}><button type="button" onClick={() => onSelect?.(error)}>{error.message}</button></li>)}</ul></div>;
}
export function StepActions({ back, next, label }) {
  return <div className="step-actions">{back ? <button type="button" className="button secondary" onClick={back}>Back</button> : <span/>}<button type="button" className="button primary" onClick={next}>{label}</button></div>;
}
