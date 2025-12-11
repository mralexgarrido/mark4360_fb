import React from 'react';
import { useWizard } from './context/WizardContext';
import { Layout } from './components/Layout';
import { WizardProvider } from './context/WizardContext';
import { CampaignStep } from './components/steps/CampaignStep';
import { AdSetStep } from './components/steps/AdSetStep';
import { AdStep } from './components/steps/AdStep';
import { ReviewStep } from './components/steps/ReviewStep';
import { LivePreview } from './components/LivePreview';

const AppContent = () => {
  const { currentStep } = useWizard();

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <CampaignStep />;
      case 1: return <AdSetStep />;
      case 2: return <AdStep />;
      case 3: return <ReviewStep />;
      default: return <CampaignStep />;
    }
  };

  return (
    <Layout LivePreview={<LivePreview />}>
      {renderStep()}
    </Layout>
  );
};

export default function App() {
  return (
    <WizardProvider>
      <AppContent />
    </WizardProvider>
  );
}
