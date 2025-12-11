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
  const { currentStep } = useAdCampaign();

  if (currentStep === 3) return null; // Hide preview on review step or show summary?
  // Actually, on review step we might want to see the ad preview too, but let's stick to the form logic
  // User might want to see the preview on the right always.
  // The ReviewStep has its own layout logic (print friendly), but in MainLayout the right panel is hidden on mobile anyway.
  // Let's keep AdPreview always visible on the right for steps 0-2.
  // For step 3, maybe we show a static summary or keep the preview.

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
