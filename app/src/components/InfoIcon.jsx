import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { educationalContent } from '../data/educationalContent';
import { createPortal } from 'react-dom';

export const InfoIcon = ({ contentKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const content = educationalContent[contentKey];

  if (!content) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center ml-2 text-blue-500 hover:text-blue-600 transition-colors focus:outline-none"
        aria-label="More info"
      >
        <Info className="w-4 h-4" />
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{content.title}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 text-gray-800 leading-relaxed text-sm space-y-4">
              <p className="whitespace-pre-wrap">{content.content}</p>

              {/* Student Note */}
              {content.studentNote && (
                <div className="mt-6 border-l-4 border-amber-400 bg-amber-50 p-4 rounded-r-md">
                   <p className="text-sm font-medium text-amber-900">
                     <span className="font-bold text-amber-700">Student Note:</span> {content.studentNote}
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
