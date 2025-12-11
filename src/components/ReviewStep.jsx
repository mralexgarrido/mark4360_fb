import React from 'react';
import { useAdCampaign } from '../context/AdCampaignContext';
import { Printer, CheckCircle, FileText } from 'lucide-react';

const ReviewStep = () => {
  const { campaignData, updateField, prevStep, resetCampaign } = useAdCampaign();

  const handlePrint = () => {
    window.print();
  };

  const handleFinish = () => {
    if (window.confirm('Are you sure you want to finish and reset the simulator?')) {
      resetCampaign();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
        <p className="text-gray-500 mt-1">Review your campaign details and document your strategy.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campaign Summary */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Campaign Details</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{campaignData.campaignName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Objective</dt>
              <dd className="font-medium text-gray-900 capitalize">{campaignData.campaignObjective}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Buying Type</dt>
              <dd className="font-medium text-gray-900 capitalize">{campaignData.buyingType}</dd>
            </div>
          </dl>
        </div>

        {/* Ad Set Summary */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Ad Set Details</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Budget</dt>
              <dd className="font-medium text-gray-900">${campaignData.budgetAmount} ({campaignData.budgetType})</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Audience</dt>
              <dd className="font-medium text-gray-900">{campaignData.ageRange} • {campaignData.gender}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Locations</dt>
              <dd className="font-medium text-gray-900 truncate max-w-[150px]">{campaignData.locations}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Strategy Documentation */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="text-blue-600" size={24} />
          <h3 className="text-lg font-bold text-blue-900">Strategy Rationale</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Student Name</label>
            <input
              type="text"
              value={campaignData.studentName}
              onChange={(e) => updateField('studentName', e.target.value)}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">
              Why did you choose this objective and audience?
            </label>
            <textarea
              value={campaignData.strategyDescription}
              onChange={(e) => updateField('strategyDescription', e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Explain your strategic thinking here. Consider your target persona and business goals..."
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={prevStep}
          className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 text-center"
        >
          Back
        </button>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-colors"
          >
            <Printer size={18} /> Print / Save PDF
          </button>

          <button
            onClick={handleFinish}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-colors"
          >
            <CheckCircle size={18} /> Finish & Reset
          </button>
        </div>
      </div>

      {/* Hidden Print Styling */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #root, #root * {
            visibility: visible;
          }
          nav, button, .sticky {
            display: none !important;
          }
          .min-h-screen {
            height: auto !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReviewStep;
