import React from 'react';
import { useWizard } from '../context/WizardContext';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

export const LivePreview = () => {
  const { ad } = useWizard();

  // Simple placeholder image logic
  const imageUrl = "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden w-full max-w-[400px] mx-auto print:block">
      {/* Ad Header */}
      <div className="p-3 flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold">
                B
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-tight">Brand Name</h4>
            <p className="text-xs text-gray-500">Sponsored · <span className="inline-block align-middle">🌐</span></p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </div>

      {/* Primary Text */}
      <div className="px-3 pb-2">
        <p className="text-sm text-gray-800 whitespace-pre-wrap">
          {ad.primaryText || "Primary text will appear here..."}
        </p>
      </div>

      {/* Ad Media */}
      <div className="bg-gray-100 aspect-square w-full flex items-center justify-center overflow-hidden">
        {ad.format === 'Video' ? (
             <div className="text-gray-400 font-medium">Video Preview Placeholder</div>
        ) : (
            <img
                src={imageUrl}
                alt="Ad Creative"
                className="w-full h-full object-cover"
            />
        )}
      </div>

      {/* Headline & CTA */}
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-2">
                <p className="text-xs text-gray-500 uppercase truncate">brandname.com</p>
                <h3 className="text-base font-bold text-gray-900 truncate">
                    {ad.headline || "Headline goes here"}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                    {ad.description || "Description..."}
                </p>
            </div>
            <button className="flex-shrink-0 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold rounded transition-colors">
                {ad.cta}
            </button>
        </div>
      </div>

      {/* Engagement Footer */}
      <div className="px-3 py-2 border-t border-gray-200 flex items-center justify-between text-gray-500">
        <div className="flex items-center space-x-1">
            <div className="flex -space-x-1">
                 <div className="w-4 h-4 bg-blue-500 rounded-full border border-white flex items-center justify-center">
                    <ThumbsUp className="w-2 h-2 text-white" />
                 </div>
            </div>
            <span className="text-xs">125</span>
        </div>
        <div className="text-xs">
            12 Comments
        </div>
      </div>
      <div className="px-2 py-1 border-t border-gray-200 grid grid-cols-3">
          <button className="flex items-center justify-center py-2 space-x-1 hover:bg-gray-50 rounded">
              <ThumbsUp className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-500">Like</span>
          </button>
           <button className="flex items-center justify-center py-2 space-x-1 hover:bg-gray-50 rounded">
              <MessageCircle className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-500">Comment</span>
          </button>
           <button className="flex items-center justify-center py-2 space-x-1 hover:bg-gray-50 rounded">
              <Share2 className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-500">Share</span>
          </button>
      </div>
    </div>
  );
};
