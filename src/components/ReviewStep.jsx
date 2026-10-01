import { useState } from 'react';
import { Printer, Send, FileText, Pause, Play } from 'lucide-react';
import { useAdCampaign } from '../context/AdCampaignContext';
import { validateCampaign } from '../lib/campaign';
import { getObjective, destinationLabels } from '../data/platformOptions';
import { Input, Textarea, Section, ErrorList } from './FormControls';
import CampaignSummary from './CampaignSummary';
import PracticeDialog from './PracticeDialog';
export default function ReviewStep() {
  const { workspace, campaignData: data, updateField: update, goToStep, publishCampaign, togglePaused, hasUnpublishedChanges, printReport, downloadReport } = useAdCampaign();
  const [confirmPublish, setConfirmPublish] = useState(false);
  const errors = validateCampaign(data);
  const props = { data, update };
  return <div className="step-content"><div className="step-heading"><span className="eyebrow">Review</span><h2>Review and publish</h2><p>Inspect the setup, record your explanation, and practice the publishing step.</p></div>
    {workspace.publication && <section className="publication-banner" aria-live="polite"><div><span className="status-badge">{workspace.publication.paused ? 'Paused · practice' : 'Published · practice'}</span><h3>{hasUnpublishedChanges ? 'Your draft has unpublished changes' : 'Publication recorded'}</h3><p>Last published: {new Date(workspace.publication.publishedAt).toLocaleString()}</p><p>A real ad would now be processed for review and delivery. This practice account runs no ads.</p></div><button type="button" className="button secondary" onClick={togglePaused}>{workspace.publication.paused ? <Play size={17}/> : <Pause size={17}/>} {workspace.publication.paused ? 'Resume practice campaign' : 'Pause practice campaign'}</button></section>}
    <Section title="Setup requirements" help="publish"><p>{errors.length ? 'Resolve the configuration issues below before publishing.' : 'Required setup fields are present and structurally valid.'}</p><p className="field-hint">These checks cover setup requirements. Your instructor evaluates the strategy and effectiveness.</p><ErrorList errors={errors} onSelect={error => { goToStep(error.step); requestAnimationFrame(() => { const element = document.getElementById(error.field) || document.getElementById(`${error.field}-field`); element?.focus(); element?.scrollIntoView({block:'center'}); }); }}/></Section>
    <CampaignSummary data={data}/>
    <Section title="Assignment documentation" help="documentation" description="Write your explanations in your own words. Follow your instructor’s assignment requirements.">
      <div className="field-grid"><Input {...props} name="studentName" label="Student name"/><Input {...props} name="courseSection" label="Course / section"/><Input {...props} name="assignmentTitle" label="Assignment title"/></div>
      <Textarea {...props} name="businessGoal" label="Business goal and offer" placeholder="What is the business trying to accomplish? What are you offering?"/>
      <Textarea {...props} name="strategyDescription" label="Why this objective and audience?" placeholder="Connect the business goal, audience needs, and selected objective."/>
      <Textarea {...props} name="budgetRationale" label="Budget and schedule explanation" placeholder="Explain your allocation and timing, including the assumptions you used."/>
      <Textarea {...props} name="creativeRationale" label="Creative, CTA, and placement explanation" placeholder="Explain the message, format, destination, and placements you selected."/>
      <Textarea {...props} name="measurementPlan" label="Measurement plan" placeholder="What would you measure, where would it be recorded, and why?"/>
      <Textarea {...props} name="revisionNotes" label="Changes made during creation" placeholder="Describe important revisions and why you made them."/>
    </Section>
    <div className="report-actions"><FileText size={22}/><div><h3>Prepare your assignment packet</h3><p>Export the full settings, selected-placement previews, explanations, and process record. Submit through your instructor’s designated channel.</p></div></div>
    <div className="button-row"><button type="button" className="button secondary" onClick={() => printReport('draft')}><Printer size={17}/>Print / Save current draft PDF</button>{workspace.publication && <button type="button" className="button secondary" onClick={() => printReport('published')}><Printer size={17}/>Print / Save published version PDF</button>}{workspace.publication && <button type="button" className="button secondary" onClick={() => downloadReport('published')}><FileText size={17}/>Download published assignment HTML</button>}</div>
    <div className="step-actions"><button type="button" className="button secondary" onClick={() => goToStep(2)}>Back to ad</button><button type="button" className="button publish" disabled={errors.length > 0 || (!!workspace.publication && !hasUnpublishedChanges)} onClick={() => setConfirmPublish(true)}><Send size={17}/>{workspace.publication ? 'Publish changes' : 'Publish in practice account'}</button></div>
    {confirmPublish && <PracticeDialog title="Confirm publication" onClose={() => setConfirmPublish(false)} footer={<><button type="button" className="button secondary" onClick={() => setConfirmPublish(false)}>Return to review</button><button type="button" className="button publish" onClick={() => { if (publishCampaign()) { setConfirmPublish(false); requestAnimationFrame(() => document.querySelector('.publication-banner')?.scrollIntoView({block:'center'})); } }}>Confirm practice publication</button></>}><dl className="confirmation-details"><div><dt>Campaign</dt><dd>{data.campaignName}</dd></div><div><dt>Objective</dt><dd>{getObjective(data.campaignObjective)?.label}</dd></div><div><dt>Destination</dt><dd>{destinationLabels[data.destination]}</dd></div><div><dt>Budget</dt><dd>${data.budgetAmount} USD ({data.budgetType})</dd></div><div><dt>Audience locations</dt><dd>{data.locations}</dd></div></dl><p className="notice">This action records the publication step locally. It does not send ads to Meta, spend money, or submit your assignment.</p></PracticeDialog>}
  </div>;
}
