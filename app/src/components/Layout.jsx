import React from 'react';
import { useWizard } from '../context/WizardContext';

export const Layout = ({ children, LivePreview }) => {
  const { currentStep, steps, goToStep } = useWizard();

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">f</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Ads Manager Simulator</h1>
        </div>
        <div className="flex space-x-4">
          {steps.map((step, index) => (
            <button
              key={step}
              onClick={() => goToStep(index)}
              disabled={index > currentStep && index !== 3} // Allow jumping back, limit forward unless reviewed?
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                index === currentStep
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {step}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Controls */}
        <div className="w-1/2 overflow-y-auto p-8 border-r border-gray-200 bg-white">
          <div className="max-w-2xl mx-auto">
             {children}
          </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="w-1/2 bg-gray-100 p-8 overflow-y-auto flex items-center justify-center relative">
          <div className="w-full max-w-md">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">
              Ad Preview
            </h2>
             {LivePreview}
          </div>
        </div>
      </div>
    </div>
  );
};
