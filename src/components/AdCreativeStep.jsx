import React, { useMemo, useState } from 'react';
import { useAdCampaign } from '../context/AdCampaignContext';
import { Image as ImageIcon, Link, Type, Upload } from 'lucide-react';
import InfoIcon from './InfoIcon';

const AdCreativeStep = () => {
  const { campaignData, updateField, nextStep, prevStep } = useAdCampaign();
  const [imageMode, setImageMode] = useState('url'); // 'url' or 'upload'

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('imageUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simple Ad Strength Logic
  const adStrength = useMemo(() => {
    let score = 0;
    if (campaignData.imageUrl) score += 25;
    if (campaignData.primaryText && campaignData.primaryText.length > 20) score += 25;
    if (campaignData.headline && campaignData.headline.length > 5) score += 25;
    if (campaignData.websiteUrl) score += 25;
    return score;
  }, [campaignData]);

  const strengthColor = adStrength < 50 ? 'bg-red-500' : adStrength < 100 ? 'bg-yellow-500' : 'bg-green-500';
  const strengthLabel = adStrength < 50 ? 'Poor' : adStrength < 100 ? 'Good' : 'Excellent';

  const handleNext = () => {
    if (campaignData.imageUrl && campaignData.primaryText && campaignData.headline && campaignData.websiteUrl) {
      nextStep();
    } else {
      alert('Please fill in all required creative fields.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Ad Creative</h2>
        <p className="text-gray-500 mt-1">Design your ad and see how it looks in the feed.</p>
      </div>

      {/* Identity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-900">Identity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center mb-1">
              <label htmlFor="facebookPage" className="block text-sm font-medium text-gray-700">
                Facebook Page
              </label>
              <InfoIcon contentKey="facebookPage" />
            </div>
            <input
              id="facebookPage"
              type="text"
              value={campaignData.facebookPage}
              onChange={(e) => updateField('facebookPage', e.target.value)}
              placeholder="e.g. My Business Page"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-center mb-1">
              <label htmlFor="instagramAccount" className="block text-sm font-medium text-gray-700">
                Instagram Account
              </label>
              <InfoIcon contentKey="instagramAccount" />
            </div>
            <input
              id="instagramAccount"
              type="text"
              value={campaignData.instagramAccount}
              onChange={(e) => updateField('instagramAccount', e.target.value)}
              placeholder="@mybusiness"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Ad Setup */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
           <div className="flex items-center">
             <h3 className="font-semibold text-gray-900">Ad Setup</h3>
             <InfoIcon contentKey="creativeFormat" />
           </div>
           <div className="flex items-center gap-2 text-sm">
             <span className="text-gray-500">Ad Strength:</span>
             <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
               <div className={`h-full ${strengthColor} transition-all duration-500`} style={{ width: `${adStrength}%` }} />
             </div>
             <span className="font-medium text-gray-700">{strengthLabel}</span>
           </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-4">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                  <ImageIcon size={16} /> Ad Media
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setImageMode('url')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      imageMode === 'url' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    URL
                  </button>
                  <button
                    onClick={() => setImageMode('upload')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      imageMode === 'upload' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Upload
                  </button>
                </div>
                <InfoIcon contentKey="imageUrl" />
              </div>
              <span className={`text-xs ${campaignData.imageUrl ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                {campaignData.imageUrl ? 'Image added (+25%)' : 'Required for Ad Strength'}
              </span>
            </div>

            {imageMode === 'url' ? (
              <div>
                <input
                  id="imageUrl"
                  type="url"
                  value={campaignData.imageUrl.startsWith('data:') ? '' : campaignData.imageUrl}
                  onChange={(e) => updateField('imageUrl', e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Paste a URL to an image. Unsplash URLs work great.</p>
              </div>
            ) : (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <div className="flex items-center">
                <label htmlFor="primaryText" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Type size={16} /> Primary Text
                </label>
                <InfoIcon contentKey="primaryText" />
              </div>
              <span className={`text-xs ${campaignData.primaryText?.length > 20 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                {campaignData.primaryText?.length || 0} / 20+ chars
              </span>
            </div>
            <textarea
              id="primaryText"
              value={campaignData.primaryText}
              onChange={(e) => updateField('primaryText', e.target.value)}
              rows={3}
              placeholder="Tell people what your ad is about..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <div className="flex items-center">
                <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                  Headline
                </label>
                <InfoIcon contentKey="headline" />
              </div>
              <span className={`text-xs ${campaignData.headline?.length > 5 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                {campaignData.headline?.length || 0} / 5+ chars
              </span>
            </div>
            <input
              id="headline"
              type="text"
              value={campaignData.headline}
              onChange={(e) => updateField('headline', e.target.value)}
              placeholder="Write a short headline"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <div className="flex items-center mb-1">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <InfoIcon contentKey="description" />
            </div>
            <input
              id="description"
              type="text"
              value={campaignData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Include additional details"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <div className="flex justify-between items-end mb-1">
                 <div className="flex items-center">
                   <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                     <Link size={16} /> Website URL
                   </label>
                   <InfoIcon contentKey="websiteUrl" />
                 </div>
                 <span className={`text-xs ${campaignData.websiteUrl ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                   {campaignData.websiteUrl ? 'Link added (+25%)' : 'Required'}
                 </span>
               </div>
               <input
                 id="websiteUrl"
                 type="url"
                 value={campaignData.websiteUrl}
                 onChange={(e) => updateField('websiteUrl', e.target.value)}
                 placeholder="https://example.com"
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg"
               />
             </div>
             <div>
               <div className="flex items-center mb-1">
                 <label htmlFor="callToAction" className="block text-sm font-medium text-gray-700">
                   Call to Action
                 </label>
                 <InfoIcon contentKey="callToAction" />
               </div>
               <select
                 id="callToAction"
                 value={campaignData.callToAction}
                 onChange={(e) => updateField('callToAction', e.target.value)}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
               >
                 <option value="learn-more">Learn More</option>
                 <option value="shop-now">Shop Now</option>
                 <option value="sign-up">Sign Up</option>
                 <option value="book-now">Book Now</option>
                 <option value="contact-us">Contact Us</option>
               </select>
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
          Next: Review
        </button>
      </div>
    </div>
  );
};

export default AdCreativeStep;
