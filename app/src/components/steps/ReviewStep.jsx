import React from 'react';
import { useWizard } from '../../context/WizardContext';
import { CheckCircle, Printer } from 'lucide-react';

export const ReviewStep = () => {
  const { campaign, adSet, ad, prevStep } = useWizard();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b pb-4 flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Review & Launch</h2>
           <p className="text-gray-600 mt-1">Double check your details before publishing.</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Campaign Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">1</span>
              Campaign
            </h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{campaign.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Objective</dt>
              <dd className="font-medium text-gray-900">{campaign.objective}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Buying Type</dt>
              <dd className="font-medium text-gray-900">{campaign.buyingType}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Special Category</dt>
              <dd className="font-medium text-gray-900">{campaign.specialCategory ? 'Yes' : 'No'}</dd>
            </div>
          </dl>
        </div>

        {/* Ad Set Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">2</span>
              Ad Set
            </h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{adSet.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Budget</dt>
              <dd className="font-medium text-gray-900">${adSet.budget} / daily</dd>
            </div>
            <div>
              <dt className="text-gray-500">Audience</dt>
              <dd className="font-medium text-gray-900">{adSet.audience}</dd>
            </div>
             <div>
              <dt className="text-gray-500">Locations</dt>
              <dd className="font-medium text-gray-900">{adSet.locations}</dd>
            </div>
          </dl>
        </div>

        {/* Ad Creative Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2">3</span>
              Ad Creative
            </h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{ad.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Format</dt>
              <dd className="font-medium text-gray-900">{ad.format}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-gray-500">Primary Text</dt>
              <dd className="font-medium text-gray-900 truncate">{ad.primaryText}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="pt-6 flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => alert("Simulation Complete! You would normally publish here.")}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg shadow-green-200 transition-all transform hover:scale-105"
        >
          Publish Campaign
        </button>
      </div>

      <div className="text-center text-xs text-gray-400 mt-8">
        This is a simulator. No actual ads will be created or charged.
      </div>
    </div>
  );
};
