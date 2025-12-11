import React, { createContext, useContext, useState, useEffect } from 'react';

const AdCampaignContext = createContext();

export const useAdCampaign = () => {
  const context = useContext(AdCampaignContext);
  if (!context) {
    throw new Error('useAdCampaign must be used within an AdCampaignProvider');
  }
  return context;
};

const initialCampaignState = {
  // Step 1: Campaign
  campaignName: '',
  buyingType: 'auction',
  spendingLimit: '',
  campaignObjective: '',
  specialCategory: 'none',

  // Step 2: Ad Set
  budgetType: 'daily',
  budgetAmount: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  locations: '',
  ageRange: '18-65+',
  gender: 'all',
  detailedTargeting: '',

  // Step 3: Ad
  facebookPage: '',
  instagramAccount: '',
  adFormat: 'single-image',
  imageUrl: '',
  primaryText: '',
  headline: '',
  description: '',
  websiteUrl: '',
  callToAction: 'learn-more',

  // Step 4: Review
  studentName: '',
  strategyDescription: ''
};

export const AdCampaignProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [campaignData, setCampaignData] = useState(() => {
    const saved = localStorage.getItem('fbAdsSimData');
    return saved ? JSON.parse(saved) : initialCampaignState;
  });

  useEffect(() => {
    localStorage.setItem('fbAdsSimData', JSON.stringify(campaignData));
  }, [campaignData]);

  const updateField = (field, value) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const goToStep = (step) => setCurrentStep(step);

  const resetCampaign = () => {
    setCampaignData(initialCampaignState);
    setCurrentStep(0);
    localStorage.removeItem('fbAdsSimData');
  };

  return (
    <AdCampaignContext.Provider value={{
      currentStep,
      campaignData,
      updateField,
      nextStep,
      prevStep,
      goToStep,
      resetCampaign
    }}>
      {children}
    </AdCampaignContext.Provider>
  );
};
