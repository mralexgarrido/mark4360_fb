import React from 'react';
import { useAdCampaign } from '../context/AdCampaignContext';
import { Target, TrendingUp, MessageCircle, Users, Download, ShoppingBag, HelpCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import InfoIcon from './InfoIcon';

const objectives = [
  { id: 'awareness', label: 'Awareness', icon: Users, desc: 'Show your ads to people who are most likely to remember them.' },
  { id: 'traffic', label: 'Traffic', icon: TrendingUp, desc: 'Send people to a destination, like your website, app or Facebook event.' },
  { id: 'engagement', label: 'Engagement', icon: MessageCircle, desc: 'Get more messages, video views, post engagement, page likes or event responses.' },
  { id: 'leads', label: 'Leads', icon: Target, desc: 'Collect leads for your business or brand.' },
  { id: 'app-promotion', label: 'App Promotion', icon: Download, desc: 'Find new people to install your app and continue using it.' },
  { id: 'sales', label: 'Sales', icon: ShoppingBag, desc: 'Find people likely to purchase your product or service.' },
];

const CampaignStep = () => {
  const { campaignData, updateField, nextStep } = useAdCampaign();

  const handleNext = () => {
    if (campaignData.campaignName && campaignData.campaignObjective) {
      nextStep();
    } else {
      alert('Please fill in Campaign Name and Objective.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Campaign Setup</h2>
        <p className="text-gray-500 mt-1">Start by defining the goal of your advertising campaign.</p>
      </div>

      {/* Campaign Name */}
      <div className="space-y-2">
        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-700">
            Campaign Name
          </label>
          <InfoIcon contentKey="campaignName" />
        </div>
        <input
          type="text"
          value={campaignData.campaignName}
          onChange={(e) => updateField('campaignName', e.target.value)}
          placeholder="e.g., Summer Sale 2024 - Awareness"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Info size={12} />
          Tip: Include the date, objective, and audience in your name.
        </p>
      </div>

      {/* Buying Type & Special Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700">
              Buying Type
            </label>
            <InfoIcon contentKey="buyingType" />
          </div>
          <div className="relative">
            <select
              value={campaignData.buyingType}
              onChange={(e) => updateField('buyingType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="auction">Auction</option>
              <option value="reach-frequency">Reach and Frequency</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700">
              Special Ad Category
            </label>
            <InfoIcon contentKey="specialCategory" />
            <span className="text-gray-400 font-normal ml-1">(Optional)</span>
          </div>
          <select
            value={campaignData.specialCategory}
            onChange={(e) => updateField('specialCategory', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="none">None</option>
            <option value="housing">Housing</option>
            <option value="employment">Employment</option>
            <option value="credit">Credit</option>
          </select>
        </div>
      </div>

      {/* Campaign Objective */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700">
              Campaign Objective
            </label>
            <InfoIcon contentKey="campaignObjective" />
          </div>
          <a href="#" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            <HelpCircle size={12} /> Help me choose
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {objectives.map((obj) => {
            const Icon = obj.icon;
            const isSelected = campaignData.campaignObjective === obj.id;

            return (
              <motion.div
                key={obj.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateField('campaignObjective', obj.id)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-lg w-fit mb-3 ${isSelected ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                  <Icon size={20} />
                </div>
                <h3 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{obj.label}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{obj.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Spending Limit */}
      <div className="space-y-2 pt-4 border-t border-gray-100">
        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-700">
            Campaign Spending Limit ($)
          </label>
          <InfoIcon contentKey="spendingLimit" />
        </div>
        <input
          type="number"
          value={campaignData.spendingLimit}
          onChange={(e) => updateField('spendingLimit', e.target.value)}
          placeholder="Optional"
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm transition-colors"
        >
          Next: Ad Set
        </button>
      </div>
    </div>
  );
};

export default CampaignStep;
