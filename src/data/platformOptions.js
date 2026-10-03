export const SIMULATOR_VERSION = '2.0.2';
export const objectives = [
  { id: 'awareness', label: 'Awareness', description: 'Build visibility for your business.', destinations: ['on-ad', 'website'], goals: ['Maximize reach', 'Maximize impressions'] },
  { id: 'traffic', label: 'Traffic', description: 'Send people to a destination.', destinations: ['website', 'messages'], goals: ['Maximize landing page views', 'Maximize link clicks'] },
  { id: 'engagement', label: 'Engagement', description: 'Encourage interactions or conversations.', destinations: ['on-ad', 'messages'], goals: ['Maximize post engagement', 'Maximize conversations'] },
  { id: 'leads', label: 'Leads', description: 'Collect inquiries from potential customers.', destinations: ['instant-form', 'website', 'messages'], goals: ['Maximize leads', 'Maximize conversations'] },
  { id: 'app-promotion', label: 'App promotion', description: 'Encourage app installs or app activity.', destinations: ['app'], goals: ['Maximize app installs', 'Maximize app events'] },
  { id: 'sales', label: 'Sales', description: 'Encourage purchases or conversions.', destinations: ['website'], goals: ['Maximize conversions', 'Maximize conversion value'] },
];
export const destinationLabels = { 'on-ad': 'On your ad', website: 'Website', 'instant-form': 'Instant form', messages: 'Messaging apps', app: 'App' };
export const placements = [
  { id: 'facebook-feed', label: 'Facebook Feed', platform: 'facebook', shape: 'feed' },
  { id: 'instagram-feed', label: 'Instagram Feed', platform: 'instagram', shape: 'feed' },
  { id: 'facebook-stories', label: 'Facebook Stories', platform: 'facebook', shape: 'story' },
  { id: 'instagram-stories', label: 'Instagram Stories', platform: 'instagram', shape: 'story' },
];
export const ctaLabels = { 'no-button': 'No button', 'learn-more': 'Learn More', 'shop-now': 'Shop Now', 'sign-up': 'Sign Up', 'book-now': 'Book Now', 'contact-us': 'Contact Us', 'send-message': 'Send Message', 'download': 'Download', 'install-now': 'Install Now' };
export const categoryLabels = { none: 'None', housing: 'Housing', employment: 'Employment', credit: 'Financial products and services (credit)' };
export const steps = ['Campaign', 'Ad set', 'Ad', 'Review & publish'];
export const getObjective = id => objectives.find(item => item.id === id);
export function getGoals(objectiveId, destination) {
  const objective = getObjective(objectiveId);
  if (!objective) return [];
  if (destination === 'messages') return ['Maximize conversations'];
  if (objectiveId === 'traffic') return ['Maximize landing page views', 'Maximize link clicks'];
  if (objectiveId === 'leads') return ['Maximize leads'];
  if (objectiveId === 'engagement') return ['Maximize post engagement'];
  return objective.goals;
}
export function getCTAs(destination) {
  if (destination === 'on-ad') return ['no-button'];
  if (destination === 'messages') return ['send-message', 'contact-us'];
  if (destination === 'app') return ['install-now', 'download', 'learn-more'];
  if (destination === 'instant-form') return ['sign-up', 'learn-more', 'contact-us'];
  return ['learn-more', 'shop-now', 'sign-up', 'book-now', 'contact-us', 'download'];
}
