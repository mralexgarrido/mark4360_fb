import { Target, TrendingUp, MessageCircle, Users, Download, ShoppingBag } from 'lucide-react';
import { useAdCampaign } from '../context/AdCampaignContext';
import { objectives, categoryLabels } from '../data/platformOptions';
import { Input, Select, Section, ErrorList, StepActions } from './FormControls';
import InfoIcon from './InfoIcon';
import useStepValidation from '../lib/useStepValidation';
const icons = [Users, TrendingUp, MessageCircle, Target, Download, ShoppingBag];
export default function CampaignStep() {
  const { campaignData: data, updateField: update, nextStep } = useAdCampaign();
  const { errors, errorFor, advance, focusError } = useStepValidation(data,0,nextStep);
  const props = { data, update };
  return <div className="step-content"><div className="step-heading"><span className="eyebrow">Campaign level</span><h2>Create a campaign</h2><p>Choose the result you want to pursue.</p></div>
    <ErrorList errors={errors} onSelect={focusError}/>
    <Section title="Campaign details" help="hierarchy"><Input {...props} name="campaignName" label="Campaign name" help="campaignName" error={errorFor('campaignName')} placeholder="Business_Objective_Period"/>
      <div className="field-grid"><Select {...props} name="buyingType" label="Buying type" help="buyingType" options={[{value:'auction',label:'Auction'}, ...(data.buyingType === 'reach-frequency' ? [{value:'reach-frequency',label:'Reach and frequency (restored draft)'}] : [])]} hint="This exercise follows the manual auction setup."/><Select {...props} name="specialCategory" label="Special ad category" help="specialCategory" options={Object.entries(categoryLabels).map(([value,label]) => ({value,label}))}/></div>
    </Section>
    <Section title="Campaign objective" help="campaignObjective"><fieldset id="campaignObjective" className="objective-options" tabIndex={-1} aria-describedby={errorFor('campaignObjective') ? 'objective-error' : undefined}><legend className="sr-only">Choose a campaign objective</legend>{objectives.map((objective,index) => {
      const Icon = icons[index];
      return <label key={objective.id} className={`objective-option ${data.campaignObjective === objective.id ? 'selected' : ''}`}><input type="radio" name="objective" value={objective.id} checked={data.campaignObjective === objective.id} onChange={() => update('campaignObjective',objective.id)}/><Icon size={23}/><strong>{objective.label}</strong><span>{objective.description}</span></label>;
    })}</fieldset>{errorFor('campaignObjective') && <p className="field-error" id="objective-error">{errorFor('campaignObjective')}</p>}
      <button type="button" className="text-button" onClick={() => document.querySelector('[aria-label="Learn about Campaign objective"]')?.click()}>Help me understand the objectives</button>
    </Section>
    <Section title="Spending controls"><Input {...props} name="spendingLimit" label="Campaign spending limit (USD)" help="spendingLimit" type="number" min="0.01" step="0.01" optional error={errorFor('spendingLimit')} hint="A campaign cap is separate from your ad set budget."/></Section>
    <div className="learning-cue"><InfoIcon contentKey="campaignObjective"/><p>Your objective sets up the choices in your ad set. Your instructor evaluates why you chose it.</p></div>
    <StepActions next={advance} label="Next: Ad set"/>
  </div>;
}
