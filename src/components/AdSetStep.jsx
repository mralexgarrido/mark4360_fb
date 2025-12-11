import React, { useMemo } from 'react';
import { useAdCampaign } from '../context/AdCampaignContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Users, DollarSign, Info } from 'lucide-react';

const AdSetStep = () => {
  const { campaignData, updateField, nextStep, prevStep } = useAdCampaign();

  // Simulated data generation based on budget
  const performanceData = useMemo(() => {
    const budget = parseFloat(campaignData.budgetAmount) || 0;
    const baseReach = budget * 50;

    // Generate a curve that shows diminishing returns
    return Array.from({ length: 7 }, (_, i) => {
      const dayBudget = budget * (1 + i * 0.1);
      return {
        name: `Day ${i + 1}`,
        reach: Math.round(baseReach * (1 + Math.log(i + 1)) * 0.5),
        clicks: Math.round(baseReach * (1 + Math.log(i + 1)) * 0.05)
      };
    });
  }, [campaignData.budgetAmount]);

  const estimatedReach = useMemo(() => {
    const budget = parseFloat(campaignData.budgetAmount) || 0;
    if (!budget) return '0';
    const min = Math.round(budget * 40);
    const max = Math.round(budget * 120);
    return `${min.toLocaleString()} - ${max.toLocaleString()}`;
  }, [campaignData.budgetAmount]);

  const handleNext = () => {
    if (campaignData.budgetAmount && campaignData.startDate && campaignData.ageRange) {
      nextStep();
    } else {
      alert('Please fill in Budget, Start Date, and Age Range.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Ad Set Configuration</h2>
        <p className="text-gray-500 mt-1">Define who you want to reach and how much you want to spend.</p>
      </div>

      {/* Budget & Schedule Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign size={20} className="text-blue-600" /> Budget & Schedule
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Type</label>
              <select
                value={campaignData.budgetType}
                onChange={(e) => updateField('budgetType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="daily">Daily Budget</option>
                <option value="lifetime">Lifetime Budget</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input
                type="number"
                value={campaignData.budgetAmount}
                onChange={(e) => updateField('budgetAmount', e.target.value)}
                placeholder="20.00"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={campaignData.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={campaignData.endDate}
                  onChange={(e) => updateField('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Budget Simulator Graph */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between">
            <div className="mb-2">
              <h4 className="text-sm font-medium text-gray-600">Estimated Daily Results</h4>
              <p className="text-2xl font-bold text-gray-900">{estimatedReach} <span className="text-sm font-normal text-gray-500">people reach</span></p>
            </div>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="reach" stroke="#3B82F6" fillOpacity={1} fill="url(#colorReach)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              *Projections based on budget and audience size.
            </p>
          </div>
        </div>
      </div>

      {/* Audience Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={20} className="text-blue-600" /> Audience Controls
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Locations</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  value={campaignData.locations}
                  onChange={(e) => updateField('locations', e.target.value)}
                  placeholder="Search locations (e.g., United States, London)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
              <select
                value={campaignData.ageRange}
                onChange={(e) => updateField('ageRange', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="18-65+">18 - 65+</option>
                <option value="18-24">18 - 24</option>
                <option value="25-34">25 - 34</option>
                <option value="35-44">35 - 44</option>
                <option value="45+">45+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={campaignData.gender}
                onChange={(e) => updateField('gender', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="all">All Genders</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Targeting</label>
            <textarea
              value={campaignData.detailedTargeting}
              onChange={(e) => updateField('detailedTargeting', e.target.value)}
              placeholder="Add demographics, interests, or behaviors..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
            />
            <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800 flex items-start gap-2">
              <Info size={16} className="mt-0.5 shrink-0" />
              <span>
                <strong>Educational Tip:</strong> Narrowing your audience too much can increase costs.
                Broader audiences allow the algorithm to find the best people.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={prevStep}
          className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm transition-colors"
        >
          Next: Ad Creative
        </button>
      </div>
    </div>
  );
};

export default AdSetStep;
