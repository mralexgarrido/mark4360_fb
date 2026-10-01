import { AdCampaignProvider, useAdCampaign } from './context/AdCampaignContext';
import { EducationalModalProvider } from './context/EducationalModalContext';
import MainLayout from './components/MainLayout';
import CampaignStep from './components/CampaignStep';
import AdSetStep from './components/AdSetStep';
import AdCreativeStep from './components/AdCreativeStep';
import ReviewStep from './components/ReviewStep';
import AdPreview from './components/AdPreview';
import AssignmentReport from './components/AssignmentReport';
function Workspace() {
  const { currentStep } = useAdCampaign();
  const panels = [CampaignStep,AdSetStep,AdCreativeStep,ReviewStep];
  const Panel = panels[currentStep] || CampaignStep;
  return <><MainLayout leftPanel={<Panel key={currentStep}/>} rightPanel={<AdPreview/>}/><AssignmentReport/></>;
}
export default function App() { return <EducationalModalProvider><AdCampaignProvider><Workspace/></AdCampaignProvider></EducationalModalProvider>; }
