import React from 'react';
import { Info } from 'lucide-react';
import { useEducationalModal } from '../context/EducationalModalContext';
import { educationalContent } from '../data/educationalContent';

const InfoIcon = ({ contentKey }) => {
  const { openModal } = useEducationalModal();
  const data = educationalContent[contentKey];

  if (!data) return null;

  const handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(contentKey);
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="inline-flex items-center justify-center text-blue-400 hover:text-blue-600 transition-colors ml-1.5 focus:outline-none cursor-pointer"
      aria-label={`Learn more about ${data.title}`}
    >
      <Info size={16} />
    </button>
  );
};

export default InfoIcon;
