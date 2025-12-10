import React from 'react';
import { useAdCampaign } from '../context/AdCampaignContext';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = [
  { id: 0, label: 'Campaign' },
  { id: 1, label: 'Ad Set' },
  { id: 2, label: 'Ad' },
  { id: 3, label: 'Review' },
];

const ProgressBar = () => {
  const { currentStep, goToStep } = useAdCampaign();

  return (
    <div className="w-full bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex justify-between items-center">
          {/* Background Line */}
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full" />

          {/* Active Line (Animated) */}
          <motion.div
            className="absolute left-0 top-1/2 h-1 bg-blue-600 -z-10 rounded-full origin-left"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => isCompleted && goToStep(step.id)} // Only allow going back to completed steps usually, or allow free nav?
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-blue-600 bg-white text-blue-600 scale-110'
                      : isCompleted
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check size={16} /> : <span>{step.id + 1}</span>}
                </div>
                <span className={`mt-2 text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
