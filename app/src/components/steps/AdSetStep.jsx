import React from 'react';
import { useWizard } from '../../context/WizardContext';
import { InfoIcon } from '../InfoIcon';

export const AdSetStep = () => {
  const { adSet, updateAdSet, nextStep, prevStep } = useWizard();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Ad Set Settings</h2>
        <p className="text-gray-600 mt-1">Define who sees your ad and how much you spend.</p>
      </div>

      <div className="space-y-6">
        {/* Ad Set Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ad Set Name
          </label>
          <input
            type="text"
            value={adSet.name}
            onChange={(e) => updateAdSet('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Daily Budget <InfoIcon contentKey="budget" />
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              value={adSet.budget}
              onChange={(e) => updateAdSet('budget', e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={adSet.startDate}
            onChange={(e) => updateAdSet('startDate', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Audience <InfoIcon contentKey="audience" />
          </label>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Simulated Audience Selection:</p>
            <select
              value={adSet.audience}
              onChange={(e) => updateAdSet('audience', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="All US, 18-65+">Broad (All US, 18-65+)</option>
              <option value="Interest: Tech">Interest: Technology</option>
              <option value="Interest: Fashion">Interest: Fashion</option>
              <option value="Lookalike 1%">Lookalike 1% (Purchasers)</option>
            </select>
          </div>
        </div>

        {/* Locations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Locations <InfoIcon contentKey="locations" />
          </label>
          <input
            type="text"
            value={adSet.locations}
            onChange={(e) => updateAdSet('locations', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Search locations..."
          />
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
          onClick={nextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Next: Ad Creative
        </button>
      </div>
    </div>
  );
};
