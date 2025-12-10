import React from 'react';
import { useAdCampaign } from '../context/AdCampaignContext';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Globe, Smartphone, Monitor, Heart, Instagram } from 'lucide-react';

const AdPreview = () => {
  const { campaignData } = useAdCampaign();
  const [previewMode, setPreviewMode] = React.useState('mobile'); // mobile | desktop
  const [platform, setPlatform] = React.useState('facebook'); // facebook | instagram

  const isInsta = platform === 'instagram';

  return (
    <div className="bg-gray-100 rounded-xl p-4 flex flex-col items-center">
      {/* Platform & Device Toggle */}
      <div className="flex justify-between w-full max-w-[500px] mb-4">
        <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
           <button
            onClick={() => setPlatform('facebook')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${!isInsta ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Globe size={14} /> Facebook
          </button>
          <button
            onClick={() => setPlatform('instagram')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${isInsta ? 'bg-pink-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Instagram size={14} /> Instagram
          </button>
        </div>

        <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`p-2 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Smartphone size={18} />
          </button>
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`p-2 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Monitor size={18} />
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${
          previewMode === 'mobile' ? 'w-[375px]' : 'w-[500px]'
        }`}
      >
        {/* Ad Header */}
        <div className="p-3 flex items-start justify-between">
          <div className="flex gap-3">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 overflow-hidden ${isInsta ? 'p-[2px] bg-gradient-to-tr from-yellow-400 to-pink-600' : 'bg-gray-200'}`}>
               <div className="w-full h-full bg-white rounded-full p-[2px]">
                 <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg overflow-hidden">
                   {(campaignData.facebookPage || campaignData.instagramAccount || 'B')[0].toUpperCase()}
                 </div>
               </div>
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-900 leading-tight">
                {isInsta ? (campaignData.instagramAccount || 'your_account') : (campaignData.facebookPage || 'Your Page Name')}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                {isInsta ? 'Sponsored' : 'Sponsored ·'} {!isInsta && <Globe size={10} />}
              </div>
            </div>
          </div>
          <MoreHorizontal size={20} className="text-gray-500" />
        </div>

        {/* Primary Text (Facebook: Above, Instagram: Below) */}
        {!isInsta && campaignData.primaryText && (
          <div className="px-3 pb-2 text-sm text-gray-900 whitespace-pre-wrap">
            {campaignData.primaryText}
          </div>
        )}

        {/* Ad Media */}
        <div className="w-full bg-gray-100 aspect-square sm:aspect-video flex items-center justify-center overflow-hidden relative">
          {campaignData.imageUrl ? (
            <img src={campaignData.imageUrl} alt="Ad Creative" className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-400 text-sm">Image Preview</div>
          )}
          {isInsta && (
             <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none shadow-inner" />
          )}
        </div>

        {/* Action Bar (Instagram) */}
        {isInsta && (
          <div className="px-3 py-2 flex justify-between items-center">
             <div className="flex gap-4">
               <Heart size={24} className="text-gray-800" />
               <MessageCircle size={24} className="text-gray-800" />
               <Share2 size={24} className="text-gray-800" />
             </div>
             <div className={`text-white bg-blue-500 px-4 py-1.5 rounded font-semibold text-sm ${campaignData.callToAction ? '' : 'opacity-0'}`}>
                {campaignData.callToAction.replace('-', ' ')}
             </div>
          </div>
        )}

        {/* Headline & CTA Area (Facebook Only) */}
        {!isInsta && (
          <div className="bg-gray-50 p-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <div className="text-xs text-gray-500 uppercase truncate">
                {campaignData.websiteUrl ? new URL(campaignData.websiteUrl).hostname : 'WEBSITE.COM'}
              </div>
              <div className="font-bold text-sm text-gray-900 truncate">
                {campaignData.headline || 'Your Headline Here'}
              </div>
              {campaignData.description && (
                <div className="text-xs text-gray-500 truncate">{campaignData.description}</div>
              )}
            </div>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold px-3 py-1.5 rounded transition-colors whitespace-nowrap">
              {campaignData.callToAction.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          </div>
        )}

        {/* Instagram Caption */}
        {isInsta && campaignData.primaryText && (
          <div className="px-3 pb-3 text-sm text-gray-900">
            <span className="font-semibold mr-2">{campaignData.instagramAccount || 'your_account'}</span>
            <span className="whitespace-pre-wrap">{campaignData.primaryText}</span>
          </div>
        )}

        {/* Social Actions (Facebook Only) */}
        {!isInsta && (
          <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between text-gray-500">
            <button className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded transition-colors flex-1 justify-center">
              <ThumbsUp size={18} /> <span className="text-xs font-medium">Like</span>
            </button>
            <button className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded transition-colors flex-1 justify-center">
              <MessageCircle size={18} /> <span className="text-xs font-medium">Comment</span>
            </button>
            <button className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1 rounded transition-colors flex-1 justify-center">
              <Share2 size={18} /> <span className="text-xs font-medium">Share</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdPreview;
