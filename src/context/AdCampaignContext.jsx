import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';

const AdCampaignContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
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
  const [campaignData, setCampaignData] = useState(initialCampaignState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load initial data from localforage
    localforage.getItem('fbAdsSimData').then((saved) => {
      if (saved) {
        setCampaignData(saved);
      }
      setIsLoaded(true);
    }).catch((err) => {
      console.error('Error loading data from localforage', err);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    // Save to localforage on changes, but only after initial load
    if (isLoaded) {
      localforage.setItem('fbAdsSimData', campaignData).catch(err => {
         console.error('Error saving data to localforage', err);
      });
    }
  }, [campaignData, isLoaded]);

  const updateField = (field, value) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const goToStep = (step) => setCurrentStep(step);

  const resetCampaign = () => {
    setCampaignData(initialCampaignState);
    setCurrentStep(0);
    localforage.removeItem('fbAdsSimData');
  };

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

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
