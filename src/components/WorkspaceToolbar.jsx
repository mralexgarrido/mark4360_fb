import { useRef, useState } from 'react';
import { Download, FolderOpen, Plus, FileText } from 'lucide-react';
import { useAdCampaign } from '../context/AdCampaignContext';
import { exportWorkspace, importWorkspace, MAX_IMPORT_BYTES } from '../lib/campaign';
import { downloadText, fileName } from '../lib/download';
import PracticeDialog from './PracticeDialog';
export default function WorkspaceToolbar() {
  const { workspace, saveStatus, resetCampaign, replaceWorkspace, recoveryData, downloadReport, workspaceForExport, exportStatus, exportBusy } = useAdCampaign();
  const input = useRef(null);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const save = () => downloadText(exportWorkspace(workspaceForExport()),fileName(workspace.data.campaignName,'json'));
  const readImport = async file => {
    if (!file) return;
    setError('');
    try { if (file.size > MAX_IMPORT_BYTES) throw new Error('Choose a campaign file no larger than 320 MB.'); const restored = importWorkspace(await file.text()); setConfirmation({type:'import',restored}); } catch (exception) { setError(exception.message); }
  };
  return <><div className="workspace-toolbar"><span className="save-status" role="status">{saveStatus}</span><div className="toolbar-actions"><button type="button" className="button small secondary" onClick={save}><Download size={16}/>Save campaign file</button><button type="button" className="button small secondary" disabled={exportBusy} onClick={() => input.current.click()}><FolderOpen size={16}/>Open campaign file</button><input ref={input} type="file" accept=".json,application/json" hidden onChange={e => { readImport(e.target.files[0]); e.target.value=''; }}/><button type="button" className="button small secondary" disabled={exportBusy} onClick={() => downloadReport('draft')}><FileText size={16}/>Download assignment HTML</button><button type="button" className="button small secondary" disabled={exportBusy} onClick={() => setConfirmation({type:'reset'})}><Plus size={16}/>New campaign</button></div></div>{exportStatus && <p className="field-hint" role="status">{exportStatus}</p>}{error && <p className="field-error" role="alert">{error}</p>}{recoveryData && <button type="button" className="button secondary" onClick={() => downloadText(JSON.stringify(recoveryData,null,2),'facebook-stored-draft-recovery.json')}>Download stored draft for recovery</button>}
    {confirmation && <PracticeDialog title={confirmation.type === 'reset' ? 'Start a new campaign?' : 'Open this campaign file?'} onClose={() => setConfirmation(null)} footer={<><button type="button" className="button secondary" onClick={() => setConfirmation(null)}>Keep current campaign</button><button type="button" className="button primary" onClick={() => { if (confirmation.type === 'reset') resetCampaign(); else replaceWorkspace(confirmation.restored); setConfirmation(null); }}>{confirmation.type === 'reset' ? 'Start new campaign' : 'Open imported campaign'}</button></>}><p>This replaces the current browser draft. Save a campaign file first if you want to keep the current work.</p><button type="button" className="button secondary" onClick={save}><Download size={16}/>Save current campaign first</button></PracticeDialog>}
  </>;
}
