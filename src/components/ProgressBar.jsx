import { useAdCampaign } from '../context/AdCampaignContext';
import { steps } from '../data/platformOptions';
export default function ProgressBar() {
  const { currentStep, goToStep } = useAdCampaign();
  return <nav className="step-navigation" aria-label="Campaign creation steps">{steps.map((label,index) => <button type="button" key={label} className={currentStep === index ? 'active' : ''} aria-current={currentStep === index ? 'step' : undefined} onClick={() => goToStep(index)}><span>{index+1}</span>{label}</button>)}</nav>;
}
