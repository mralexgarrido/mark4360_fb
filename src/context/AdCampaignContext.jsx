import { createContext, useContext, useEffect, useRef, useState } from 'react';
import localforage from 'localforage';
import { blankWorkspace, migrateWorkspace, STORAGE_KEY, LEGACY_KEY, publicationSnapshot, applyCampaignField, campaignChanged } from '../lib/campaign';
import { downloadText, fileName } from '../lib/download';
import reportStyles from '../report.css?inline';
import { steps } from '../data/platformOptions';
const AdCampaignContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAdCampaign = () => useContext(AdCampaignContext);
const addEvent = (workspace, text) => [...workspace.events, { at: new Date().toISOString(), text }].slice(-150);
export function AdCampaignProvider({ children }) {
  const [workspace, setWorkspace] = useState(blankWorkspace);
  const [reportSource, setReportSource] = useState('draft');
  const [isLoaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Loading draft');
  const [storageError, setStorageError] = useState('');
  const [recoveryData, setRecoveryData] = useState(null);
  const [saveBlocked, setSaveBlocked] = useState(false);
  const writeQueue = useRef(Promise.resolve());
  const mounted = useRef(false);
  const edits = useRef(new Set());
  useEffect(() => {
    mounted.current = true;
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
    const timer = setTimeout(() => {
      setSaveStatus('Saving in this browser');
      writeQueue.current = writeQueue.current.catch(() => {}).then(() => localforage.setItem(STORAGE_KEY, workspace)).then(() => {
        if (mounted.current) { setSaveStatus('Saved in this browser'); setStorageError(''); }
      }).catch(() => {
        if (mounted.current) { setSaveStatus('Draft is not saved'); setStorageError('Browser storage is unavailable or full. Download a campaign file to keep your work.'); }
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [workspace, isLoaded, saveBlocked]);
  const updateField = (field, value) => {
    edits.current.add(field);
    setWorkspace(previous => ({ ...previous, data: applyCampaignField(previous.data, field, value) }));
  };
  const goToStep = step => {
    if (step < 0 || step > 3) return;
    const changedFields = [...edits.current].filter(field => !['imageUrl','carouselCards'].includes(field));
    edits.current.clear();
    setWorkspace(previous => ({ ...previous, currentStep: step, events: addEvent(previous, `Opened ${steps[step]}${changedFields.length ? `. Updated fields: ${changedFields.join(', ')}.` : '.'}`) }));
  };
  const publishCampaign = () => {
    const snapshot = publicationSnapshot(workspace.data);
    if (!snapshot) return false;
    edits.current.clear();
    setWorkspace(previous => ({ ...previous, publication: snapshot, events: addEvent(previous, previous.publication ? 'Published campaign changes in the practice account.' : 'Published the campaign in the practice account.') }));
    return true;
  };
  const togglePaused = () => setWorkspace(previous => !previous.publication ? previous : ({ ...previous, publication: { ...previous.publication, paused: !previous.publication.paused }, events: addEvent(previous, previous.publication.paused ? 'Resumed the practice campaign.' : 'Paused the practice campaign.') }));
  const replaceWorkspace = replacement => {
    edits.current.clear(); setSaveBlocked(false); setRecoveryData(null); setStorageError('');
    setWorkspace({ ...replacement, events: addEvent(replacement, 'Imported a saved campaign file.') });
  };
  const resetCampaign = () => {
    edits.current.clear(); setSaveBlocked(false); setRecoveryData(null); setStorageError(''); setWorkspace(blankWorkspace());
    // Queue behind any pending save so reset cannot race with persistence.
    writeQueue.current = writeQueue.current.catch(() => {}).then(() => localforage.removeItem(LEGACY_KEY)).catch(() => {
      if (mounted.current) setStorageError('The older stored draft could not be removed. Download your work before clearing site data.');
    });
  };
  const printReport = source => { setReportSource(source); requestAnimationFrame(() => requestAnimationFrame(() => window.print())); };
  const downloadReport = source => {
    setReportSource(source);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const report = document.getElementById('assignment-report');
      if (report) downloadText(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Facebook campaign assignment</title><style>${reportStyles}</style></head><body class="standalone-report">${report.outerHTML}</body></html>`, fileName(workspace.data.campaignName + '-' + source + '-assignment','html'), 'text/html');
    }));
  };
  if (!isLoaded) return <div className="loading-screen" role="status">Opening your campaign workspace…</div>;
  return <AdCampaignContext.Provider value={{ workspace, campaignData: workspace.data, currentStep: workspace.currentStep, updateField, goToStep, nextStep: () => goToStep(workspace.currentStep+1), prevStep: () => goToStep(workspace.currentStep-1), resetCampaign, replaceWorkspace, publishCampaign, togglePaused, saveStatus, storageError, recoveryData, hasUnpublishedChanges: campaignChanged(workspace.data, workspace.publication), reportSource, printReport, downloadReport }}>{children}</AdCampaignContext.Provider>;
}
