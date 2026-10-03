import { createContext, createElement, useContext, useEffect, useRef, useState } from 'react';
import localforage from 'localforage';
import { blankWorkspace, migrateWorkspace, STORAGE_KEY, LEGACY_KEY, publicationSnapshot, applyCampaignField, campaignChanged, recordFieldEdit } from '../lib/campaign';
import { downloadText, fileName } from '../lib/download';
import reportStyles from '../report.css?inline';
import { steps } from '../data/platformOptions';
import AssignmentReportContent from '../components/AssignmentReportContent';
import { createWorkspaceSaver } from '../lib/workspaceSaver';
import { waitForReportImages } from '../lib/reportImages';
const AdCampaignContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAdCampaign = () => useContext(AdCampaignContext);
const addEvent = (workspace, text) => [...workspace.events, { at: new Date().toISOString(), text }].slice(-150);
export function AdCampaignProvider({ children }) {
  const [workspace, setWorkspace] = useState(blankWorkspace);
  const [reportSource, setReportSource] = useState('draft');
  const [reportWorkspace, setReportWorkspace] = useState(null);
  const [exportStatus, setExportStatus] = useState('');
  const [exportBusy, setExportBusy] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Loading draft');
  const [storageError, setStorageError] = useState('');
  const [recoveryData, setRecoveryData] = useState(null);
  const [saveBlocked, setSaveBlocked] = useState(false);
  const mounted = useRef(false);
  const edits = useRef(new Set());
  const pendingSave = useRef(false);
  const saver = useRef(null);
  useEffect(() => {
    mounted.current = true;
    saver.current = createWorkspaceSaver(value => localforage.setItem(STORAGE_KEY, value), () => {
      pendingSave.current = false;
      if (mounted.current) { setSaveStatus('Saved in this browser'); setStorageError(''); }
    }, () => {
      pendingSave.current = true;
      if (mounted.current) { setSaveStatus('Draft is not saved'); setStorageError('Browser storage is unavailable or full. Download a campaign file to keep your work.'); }
    });
    let cancelled = false;
    (async () => {
      let raw;
      try {
        raw = await localforage.getItem(STORAGE_KEY);
        if (!raw) raw = await localforage.getItem(LEGACY_KEY);
        const restored = migrateWorkspace(raw);
        if (!cancelled) { setWorkspace(restored); setSaveStatus(raw ? 'Draft restored' : 'Saved in this browser'); }
      } catch (error) {
        if (!cancelled) { setStorageError(`Draft could not be loaded: ${error.message}`); setRecoveryData(raw || null); setSaveBlocked(true); setSaveStatus('Storage unavailable'); }
      } finally { if (!cancelled) setLoaded(true); }
    })();
    return () => { cancelled = true; mounted.current = false; };
  }, []);
  useEffect(() => {
    if (!isLoaded || saveBlocked) return;
    saver.current.save(workspace);
  }, [workspace, isLoaded, saveBlocked]);
  useEffect(() => {
    const guardUnsavedWork = event => {
      if (!pendingSave.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    const finishPrint = () => { setReportWorkspace(null); setReportSource('draft'); };
    window.addEventListener('beforeunload', guardUnsavedWork);
    window.addEventListener('afterprint', finishPrint);
    return () => { window.removeEventListener('beforeunload', guardUnsavedWork); window.removeEventListener('afterprint', finishPrint); };
  }, []);
  const markPending = () => {
    saver.current.markDirty(); pendingSave.current = true; setSaveStatus('Saving in this browser');
    if (!exportBusy) { setReportWorkspace(null); setReportSource('draft'); setExportStatus(''); }
  };
  const workspaceForExport = () => {
    const fields = [...edits.current];
    return fields.length ? { ...workspace, events: addEvent(workspace, `Current draft edits included in this export: ${fields.join(', ')}.`) } : workspace;
  };
  const updateField = (field, value) => {
    if (workspace.data[field] === value) return;
    markPending();
    edits.current.add(field);
    setWorkspace(previous => ({ ...previous, data: applyCampaignField(previous.data, field, value), events: recordFieldEdit(previous.events, field) }));
  };
  const goToStep = step => {
    if (step < 0 || step > 3) return;
    markPending();
    const changedFields = [...edits.current];
    edits.current.clear();
    setWorkspace(previous => ({ ...previous, currentStep: step, events: addEvent(previous, `Opened ${steps[step]}${changedFields.length ? `. Updated fields: ${changedFields.join(', ')}.` : '.'}`) }));
    requestAnimationFrame(() => {
      const panel = document.getElementById('step-main');
      panel?.focus({ preventScroll: true });
      panel?.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  };
  const publishCampaign = () => {
    const snapshot = publicationSnapshot(workspace.data);
    if (!snapshot) return false;
    markPending();
    edits.current.clear();
    setWorkspace(previous => ({ ...previous, publication: snapshot, events: addEvent(previous, previous.publication ? 'Published campaign changes in the practice account.' : 'Published the campaign in the practice account.') }));
    return true;
  };
  const togglePaused = () => { markPending(); setWorkspace(previous => !previous.publication ? previous : ({ ...previous, publication: { ...previous.publication, paused: !previous.publication.paused }, events: addEvent(previous, previous.publication.paused ? 'Resumed the practice campaign.' : 'Paused the practice campaign.') })); };
  const replaceWorkspace = replacement => {
    markPending(); setReportWorkspace(null); setReportSource('draft');
    edits.current.clear(); setSaveBlocked(false); setRecoveryData(null); setStorageError('');
    setWorkspace({ ...replacement, events: addEvent(replacement, 'Imported a saved campaign file.') });
  };
  const resetCampaign = () => {
    markPending(); setReportWorkspace(null); setReportSource('draft');
    edits.current.clear(); setSaveBlocked(false); setRecoveryData(null); setStorageError(''); setWorkspace(blankWorkspace());
    localforage.removeItem(LEGACY_KEY).catch(() => {
      if (mounted.current) setStorageError('The older stored draft could not be removed. Download your work before clearing site data.');
    });
  };
  const printReport = source => {
    setExportBusy(true); setExportStatus('Preparing images for printing…');
    setReportWorkspace(workspaceForExport()); setReportSource(source);
    requestAnimationFrame(() => requestAnimationFrame(async () => {
      try {
        const report = document.getElementById('assignment-report');
        if (!report) throw new Error('The assignment report could not be prepared. Try again.');
        const images = await waitForReportImages(report);
        if (images.some(loaded => !loaded)) {
          setExportStatus('Some images could not be loaded. Replace unavailable image URLs or upload the images, then print again.');
          setReportWorkspace(null); setReportSource('draft');
          return;
        }
        setExportStatus('Print dialog opened. Choose Save as PDF to download your assignment.');
        window.print();
      } catch (error) { setExportStatus(error.message); setReportWorkspace(null); setReportSource('draft'); }
      finally { setExportBusy(false); }
    }));
  };
  const downloadReport = async source => {
    const snapshot = workspaceForExport();
    setExportBusy(true); setExportStatus('Preparing assignment HTML…');
    try {
      const { renderToStaticMarkup } = await import('react-dom/server');
      const report = renderToStaticMarkup(createElement(AssignmentReportContent, { workspace: snapshot, reportSource: source }));
      downloadText(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Facebook campaign assignment</title><style>${reportStyles}</style></head><body class="standalone-report">${report}</body></html>`, fileName(snapshot.data.campaignName,'html',`${source}-assignment`), 'text/html');
      setExportStatus(`${source === 'published' ? 'Published assignment' : 'Current draft assignment'} HTML prepared. Check your browser downloads. Keep the campaign JSON file to resume editing.`);
    } catch { setExportStatus('The assignment could not be downloaded. Try again or save a campaign file to keep your work.'); }
    finally { setExportBusy(false); }
  };
  if (!isLoaded) return <div className="loading-screen" role="status">Opening your campaign workspace…</div>;
  return <AdCampaignContext.Provider value={{ workspace, campaignData: workspace.data, currentStep: workspace.currentStep, updateField, goToStep, nextStep: () => goToStep(workspace.currentStep+1), prevStep: () => goToStep(workspace.currentStep-1), resetCampaign, replaceWorkspace, publishCampaign, togglePaused, saveStatus, storageError, recoveryData, hasUnpublishedChanges: campaignChanged(workspace.data, workspace.publication), reportSource, reportWorkspace, printReport, downloadReport, workspaceForExport, exportStatus, exportBusy }}>{children}</AdCampaignContext.Provider>;
}
