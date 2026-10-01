import { useAdCampaign } from '../context/AdCampaignContext';
import { getObjective, getGoals, destinationLabels, placements } from '../data/platformOptions';
import { budgetSummary } from '../lib/campaign';
import { Input, Select, Textarea, Section, ErrorList, StepActions } from './FormControls';
import useStepValidation from '../lib/useStepValidation';
export default function AdSetStep() {
  const { campaignData: data, updateField: update, nextStep, prevStep } = useAdCampaign();
  const { errors, errorFor, advance, focusError } = useStepValidation(data,1,nextStep);
  const props = { data, update };
  const objective = getObjective(data.campaignObjective);
  const restricted = data.specialCategory !== 'none';
  const goals = getGoals(data.campaignObjective,data.destination);
  return <div className="step-content"><div className="step-heading"><span className="eyebrow">Ad set level</span><h2>Configure delivery</h2><p>Choose where the action happens, who you want to reach, and how to allocate the budget.</p></div><ErrorList errors={errors} onSelect={focusError}/>
    <Section title="Ad set details"><Input {...props} name="adSetName" label="Ad set name" error={errorFor('adSetName')} placeholder="Audience_Placement_Period"/></Section>
    <Section title="Conversion and performance" help="destination">
      {!objective && <p className="notice">Choose a campaign objective in the Campaign tab to configure these settings.</p>}
      <div className="field-grid"><Select {...props} name="destination" label="Conversion location" help="destination" options={(objective?.destinations || []).map(value => ({value,label:destinationLabels[value]}))} error={errorFor('destination')}/><Select {...props} name="performanceGoal" label="Performance goal" help="performanceGoal" options={goals} error={errorFor('performanceGoal')}/></div>
      {data.destination === 'website' && ['sales','leads'].includes(data.campaignObjective) && <div className="field-grid"><Input {...props} name="datasetName" label="Dataset name" help="datasetName" hint="Practice label. No dataset is connected." error={errorFor('datasetName')}/><Select {...props} name="conversionEvent" label="Conversion event" help="datasetName" options={['Purchase','Lead','CompleteRegistration','AddToCart','ViewContent']}/></div>}
    </Section>
    <Section title="Budget and schedule" help="budget"><div className="field-grid"><Select {...props} name="budgetType" label="Budget type" options={[{value:'daily',label:'Daily budget'},{value:'lifetime',label:'Lifetime budget'}]}/><Input {...props} name="budgetAmount" label="Budget amount (USD)" type="number" min="0.01" step="0.01" error={errorFor('budgetAmount')}/><Input {...props} name="startDate" label="Start date" type="date" help="schedule" error={errorFor('startDate')}/><Input {...props} name="startTime" label="Start time" type="time" error={errorFor('startTime')}/><Input {...props} name="endDate" label="End date" type="date" min={data.startDate} optional={data.budgetType === 'daily'} error={errorFor('endDate')}/><Select {...props} name="timezone" label="Account time zone" help="schedule" error={errorFor('timezone')} options={[...new Set([data.timezone,'America/Chicago','America/New_York','America/Denver','America/Los_Angeles','America/Mexico_City','Europe/Madrid','UTC'])]}/></div><div className="budget-summary"><strong>Planned allocation</strong><p>{budgetSummary(data)}</p><small>Calendar-day planning arithmetic. Actual daily spending can vary.</small></div></Section>
    <Section title="Audience" help="audience"><Select {...props} name="audienceMode" label="Audience type" options={[{value:'original',label:'Original audience'},{value:'custom',label:'Custom audience'},{value:'lookalike',label:'Lookalike audience'}]}/>
      {data.audienceMode !== 'original' && <Textarea {...props} name="audienceSource" label="Audience source description" help="audienceSource" error={errorFor('audienceSource')} placeholder="Describe the interaction or source you would use. No customer records."/>}
      <Input {...props} name="locations" label="Locations" help="audience" hint="Record countries, cities, or service areas. No location database is connected." error={errorFor('locations')} placeholder="e.g., Edinburg and McAllen, Texas"/>
      {restricted && <p className="notice">For this practice category, age and gender are broadened. Other real-platform restrictions can depend on the category and jurisdiction.</p>}
      <div className="field-grid"><Select {...props} name="ageRange" label="Age range" options={[{value:'18-65+',label:'18–65+'},{value:'18-24',label:'18–24'},{value:'25-34',label:'25–34'},{value:'35-44',label:'35–44'},{value:'45+',label:'45+'}]} disabled={restricted} error={errorFor('ageRange')}/><Select {...props} name="gender" label="Gender" options={[{value:'all',label:'All genders'},{value:'men',label:'Men'},{value:'women',label:'Women'}]} disabled={restricted}/></div>
      <Textarea {...props} name="detailedTargeting" label="Detailed targeting plan" help="audience" optional placeholder="Describe the interests, behaviors, or demographics you would consider." hint="A planning description. This field does not verify targeting availability."/>
    </Section>
    <Section title="Placements" help="placements"><Select {...props} name="placementMode" label="Placement control" options={[{value:'advantage',label:'Advantage+ placements'},{value:'manual',label:'Manual placements'}]}/><p className="field-hint">This exercise represents four placements. Real accounts may offer additional eligible surfaces.</p>
      <fieldset id="placements" className="placement-options" tabIndex={-1}><legend className="sr-only">Placement selection</legend>{placements.map(placement => <label key={placement.id}><input type="checkbox" checked={data.placementMode === 'advantage' || data.placements.includes(placement.id)} disabled={data.placementMode === 'advantage'} onChange={e => update('placements',e.target.checked ? [...data.placements,placement.id] : data.placements.filter(id => id !== placement.id))}/>{placement.label}</label>)}</fieldset>{errorFor('placements') && <p className="field-error">{errorFor('placements')}</p>}
    </Section><StepActions back={prevStep} next={advance} label="Next: Ad"/>
  </div>;
}
