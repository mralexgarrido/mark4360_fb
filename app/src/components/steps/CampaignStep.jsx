import React from 'react';
import { useWizard } from '../../context/WizardContext';
import { InfoIcon } from '../InfoIcon';

export const CampaignStep = () => {
  const { campaign, updateCampaign, nextStep } = useWizard();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Campaign Settings</h2>
        <p className="text-gray-600 mt-1">Set the foundation for your ad.</p>
      </div>

      <div className="space-y-6">
        {/* Campaign Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Name <InfoIcon contentKey="campaignName" />
          </label>
          <input
            type="text"
            value={campaign.name}
            onChange={(e) => updateCampaign('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="e.g., Summer Sale 2024"
          />
        </div>

        {/* Buying Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buying Type <InfoIcon contentKey="buyingType" />
          </label>
          <select
            value={campaign.buyingType}
            onChange={(e) => updateCampaign('buyingType', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="Auction">Auction</option>
            <option value="Reach and Frequency">Reach and Frequency</option>
          </select>
        </div>

        {/* Campaign Objective */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Objective <InfoIcon contentKey="campaignObjective" />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Awareness', 'Traffic', 'Sales'].map((obj) => (
              <button
                key={obj}
                onClick={() => updateCampaign('objective', obj)}
                className={`p-4 border rounded-xl text-left transition-all ${
                  campaign.objective === obj
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold text-gray-900">{obj}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Special Ad Categories */}
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="specialCategory"
            checked={campaign.specialCategory}
            onChange={(e) => updateCampaign('specialCategory', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="specialCategory" className="text-sm text-gray-700 flex items-center">
            Declare Special Ad Category <InfoIcon contentKey="specialCategory" />
          </label>
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button
          onClick={nextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Next: Ad Set
        </button>
      </div>
    </div>
  );
};
