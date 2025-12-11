import React from 'react';
import { useAdCampaign } from '../context/AdCampaignContext';
import ProgressBar from './ProgressBar';

const MainLayout = ({ leftPanel, rightPanel }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <ProgressBar />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left Panel: Configuration (Scrollable) */}
          <div className="flex-1 lg:w-3/5 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
            {leftPanel}
          </div>

          {/* Right Panel: Preview/Simulator (Sticky) */}
          <div className="lg:w-2/5 hidden lg:block print:block">
            <div className="sticky top-28 space-y-6 print:static">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden print:border-none print:shadow-none print:p-0">
                <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 border-b pb-2 print:hidden">
                  Live Preview & Analysis
                </h3>
                {rightPanel}
              </div>

              {/* Educational Context Widget (Example) */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">Pro Tip</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Always double-check your audience definition. A broader audience isn't always better if it's not relevant.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
