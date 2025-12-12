import React, { createContext, useContext, useState } from 'react';
import EducationalModal from '../components/EducationalModal';
import { educationalContent } from '../data/educationalContent';

const EducationalModalContext = createContext();

export const useEducationalModal = () => {
  const context = useContext(EducationalModalContext);
  if (!context) {
    throw new Error('useEducationalModal must be used within an EducationalModalProvider');
  }
  return context;
};

export const EducationalModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);

  const openModal = (contentKey) => {
    const data = educationalContent[contentKey];
    if (data) {
      setCurrentContent(data);
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    // Optional: Clear content after animation, but keeping it for now to avoid flicker during exit
  };

  return (
    <EducationalModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {/*
        Render the modal here.
        Note: EducationalModal uses createPortal internally to mount to document.body,
        so placement here just ensures it's part of the React tree.
      */}
      {isOpen && currentContent && (
        <EducationalModal
          onClose={closeModal}
          title={currentContent.title}
          content={currentContent.content}
        />
      )}
    </EducationalModalContext.Provider>
  );
};
