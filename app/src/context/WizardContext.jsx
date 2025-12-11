import React, { createContext, useContext, useState } from 'react';

const WizardContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useWizard = () => useContext(WizardContext);

export const WizardProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [campaign, setCampaign] = useState({
    name: 'My Campaign',
    buyingType: 'Auction',
    objective: 'Awareness',
    specialCategory: false,
  });

  const [adSet, setAdSet] = useState({
    name: 'New Ad Set',
    budget: 20,
    startDate: new Date().toISOString().split('T')[0],
    audience: 'All US, 18-65+',
    locations: 'United States',
  });

  const [ad, setAd] = useState({
    name: 'New Ad',
    format: 'Single Image',
    primaryText: 'Check out our amazing product! #NewArrival',
    headline: '50% Off Everything',
    description: 'Limited time offer.',
    cta: 'Shop Now',
    image: null, // Placeholder logic will handle null
  });

  const steps = ['Campaign', 'Ad Set', 'Ad', 'Review'];

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const goToStep = (stepIndex) => setCurrentStep(stepIndex);

  const updateCampaign = (field, value) => setCampaign(prev => ({ ...prev, [field]: value }));
  const updateAdSet = (field, value) => setAdSet(prev => ({ ...prev, [field]: value }));
  const updateAd = (field, value) => setAd(prev => ({ ...prev, [field]: value }));

  return (
    <WizardContext.Provider value={{
      currentStep,
      steps,
      nextStep,
      prevStep,
      goToStep,
      campaign,
      updateCampaign,
      adSet,
      updateAdSet,
      ad,
      updateAd
    }}>
      {children}
    </WizardContext.Provider>
  );
};
