import React from 'react';
import { AdCampaignProvider, useAdCampaign } from './context/AdCampaignContext';
import MainLayout from './components/MainLayout';
import CampaignStep from './components/CampaignStep';
import AdSetStep from './components/AdSetStep';
import AdCreativeStep from './components/AdCreativeStep';
import ReviewStep from './components/ReviewStep';
import AdPreview from './components/AdPreview';

const StepContent = () => {
  const { currentStep } = useAdCampaign();

  switch (currentStep) {
    case 0:
      return <CampaignStep />;
    case 1:
      return <AdSetStep />;
    case 2:
      return <AdCreativeStep />;
    case 3:
      return <ReviewStep />;
    default:
      return <CampaignStep />;
  }
};

const PreviewContent = () => {
  // We want the preview to be visible on all steps, including Review (step 3)
  return <AdPreview />;
};

function App() {
  return (
    <AdCampaignProvider>
      <MainLayout
        leftPanel={<StepContent />}
        rightPanel={<PreviewContent />}
      />
    </AdCampaignProvider>
  );
}

export default App;
