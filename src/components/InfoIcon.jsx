import React, { useState } from 'react';
import { Info } from 'lucide-react';
import EducationalModal from './EducationalModal';
import { educationalContent } from '../data/educationalContent';
import { AnimatePresence } from 'framer-motion';

const InfoIcon = ({ contentKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const data = educationalContent[contentKey];

  if (!data) return null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault(); // Prevent bubbling to label
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="inline-flex items-center justify-center text-blue-400 hover:text-blue-600 transition-colors ml-1.5 focus:outline-none cursor-pointer"
        aria-label={`Learn more about ${data.title}`}
      >
        <Info size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <EducationalModal
            onClose={() => setIsOpen(false)}
            title={data.title}
            content={data.content}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default InfoIcon;
