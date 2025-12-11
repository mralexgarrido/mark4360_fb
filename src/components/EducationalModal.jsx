import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const EducationalModal = ({ onClose, title, content }) => {
  const handleBackdropClick = (e) => {
    e.stopPropagation(); // Stop bubbling to React tree (InfoIcon -> Label)
    onClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const handleCloseButtonClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={handleContentClick}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden"
      >
        <div className="bg-blue-600 p-6 flex justify-between items-start">
          <h3 className="text-xl font-bold text-white pr-8">{title}</h3>
          <button
            onClick={handleCloseButtonClick}
            className="text-blue-100 hover:text-white transition-colors bg-blue-700 hover:bg-blue-800 rounded-full p-1 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-line">
            {content}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Student Note:</strong> Understanding this concept is key for your justification in the final review step.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default EducationalModal;
