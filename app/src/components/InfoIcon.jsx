import React from 'react';
import { Info } from 'lucide-react';
import { educationalContent } from '../data/educationalContent';

export const InfoIcon = ({ contentKey }) => {
  const content = educationalContent[contentKey];

  if (!content) return null;

  return (
    <div className="group relative inline-block ml-2 align-middle">
      <Info className="w-4 h-4 text-blue-500 cursor-help" />
      <div className="invisible group-hover:visible absolute z-50 w-64 p-3 mt-2 -ml-32 text-sm text-white bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <h4 className="font-bold mb-1">{content.title}</h4>
        <p className="whitespace-pre-wrap">{content.content}</p>
        <div className="absolute bottom-full left-1/2 -ml-2 border-4 border-transparent border-b-gray-800"></div>
      </div>
    </div>
  );
};
