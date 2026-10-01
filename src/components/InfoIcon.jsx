import { Info } from 'lucide-react';
import { useEducationalModal } from '../context/EducationalModalContext';
import { educationalContent } from '../data/educationalContent';
export default function InfoIcon({ contentKey }) {
  const { openModal } = useEducationalModal();
  if (!educationalContent[contentKey]) return null;
  return <button type="button" className="info-button" aria-label={`Learn about ${educationalContent[contentKey].title}`} onClick={() => openModal(contentKey)}><Info size={17}/></button>;
}
