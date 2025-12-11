import React from 'react';
import { useWizard } from '../../context/WizardContext';
import { InfoIcon } from '../InfoIcon';
import { Image as ImageIcon, Type, MousePointer } from 'lucide-react';

export const AdStep = () => {
  const { ad, updateAd, nextStep, prevStep } = useWizard();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Ad Creative</h2>
        <p className="text-gray-600 mt-1">Design what your audience will see.</p>
      </div>

      <div className="space-y-6">
        {/* Ad Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ad Name
          </label>
          <input
            type="text"
            value={ad.name}
            onChange={(e) => updateAd('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Format <InfoIcon contentKey="creativeFormat" />
          </label>
          <div className="grid grid-cols-3 gap-4">
            {['Single Image', 'Carousel', 'Video'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => updateAd('format', fmt)}
                className={`p-3 border rounded-lg text-center text-sm transition-all ${
                  ad.format === fmt
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Media Upload Simulation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Media
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
            <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              Click to simulate upload (Uses placeholder)
            </p>
             {/* In a real app this would be a file input. Here we just keep the default placeholder logic implied */}
          </div>
        </div>

        {/* Primary Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary Text <InfoIcon contentKey="primaryText" />
          </label>
          <div className="relative">
             <Type className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
            <textarea
              value={ad.primaryText}
              onChange={(e) => updateAd('primaryText', e.target.value)}
              rows={3}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Tell people what your ad is about..."
            />
          </div>
        </div>

        {/* Headline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Headline <InfoIcon contentKey="headline" />
          </label>
          <input
            type="text"
            value={ad.headline}
            onChange={(e) => updateAd('headline', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Write a short headline..."
          />
        </div>

        {/* Call To Action */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Call To Action <InfoIcon contentKey="callToAction" />
          </label>
          <div className="relative">
            <MousePointer className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
            <select
              value={ad.cta}
              onChange={(e) => updateAd('cta', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="Shop Now">Shop Now</option>
              <option value="Learn More">Learn More</option>
              <option value="Sign Up">Sign Up</option>
              <option value="Book Now">Book Now</option>
              <option value="Download">Download</option>
            </select>
          </div>
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
          Next: Review
        </button>
      </div>
    </div>
  );
};
