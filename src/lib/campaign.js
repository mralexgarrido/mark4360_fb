import { getObjective, getGoals, getCTAs, placements, SIMULATOR_VERSION } from '../data/platformOptions.js';
export const STORAGE_KEY = 'fbAdsSimWorkspace_v2';
export const LEGACY_KEY = 'fbAdsSimData';
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
// A workspace may contain eleven 10 MB uploaded assets in both its draft and
// publication. Allow their base64 expansion plus settings and documentation.
export const MAX_IMPORT_BYTES = 320 * 1024 * 1024;
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function blankCampaign() {
  return {
    campaignName: '', campaignObjective: '', buyingType: 'auction', specialCategory: 'none', spendingLimit: '',
    adSetName: '', destination: '', performanceGoal: '', datasetName: '', conversionEvent: 'Purchase',
    budgetType: 'daily', budgetAmount: '', startDate: localDate(), endDate: '', startTime: '09:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Chicago', currency: 'USD',
    locations: '', ageRange: '18-65+', gender: 'all', detailedTargeting: '', audienceMode: 'original', audienceSource: '',
    placementMode: 'advantage', placements: placements.map(p => p.id),
    adName: '', facebookPage: '', instagramAccount: '', adFormat: 'single-image', imageUrl: '', imageName: '', imageAlt: '',
    primaryText: '', headline: '', description: '', websiteUrl: '', callToAction: 'learn-more', urlParameters: '',
    appName: '', appStore: 'Apple App Store', appUrl: '', messageApp: 'Messenger', messageGreeting: '',
    formName: '', formHeadline: '', formDescription: '', formQuestions: ['Full name', 'Email'], privacyUrl: '', thankYouMessage: '',
    carouselCards: [], studentName: '', courseSection: '', assignmentTitle: '', businessGoal: '', strategyDescription: '',
    budgetRationale: '', creativeRationale: '', measurementPlan: '', revisionNotes: '',
  };
}
export function blankWorkspace() {
  return { schemaVersion: 2, simulatorVersion: SIMULATOR_VERSION, data: blankCampaign(), currentStep: 0, events: [], publication: null };
}
export function recordFieldEdit(events, field, at = new Date().toISOString()) {
  const entry = { at, text: `Edited ${field}.` };
  const previous = events.at(-1);
  return (previous?.text === entry.text ? [...events.slice(0,-1), entry] : [...events, entry]).slice(-150);
}
const enums = {
  campaignObjective: ['', 'awareness', 'traffic', 'engagement', 'leads', 'app-promotion', 'sales'],
  buyingType: ['auction', 'reach-frequency'], specialCategory: ['none', 'housing', 'employment', 'credit'],
  destination: ['', 'on-ad', 'website', 'instant-form', 'messages', 'app'],
  budgetType: ['daily', 'lifetime'], gender: ['all', 'men', 'women'], audienceMode: ['original', 'custom', 'lookalike'],
  ageRange: ['18-65+', '18-24', '25-34', '35-44', '45+'], placementMode: ['advantage', 'manual'],
  adFormat: ['single-image', 'carousel'], currency: ['USD'], messageApp: ['Messenger', 'Instagram'],
  appStore: ['Apple App Store', 'Google Play', 'Meta Horizon Store'],
  conversionEvent: ['Purchase', 'Lead', 'CompleteRegistration', 'AddToCart', 'ViewContent'],
  callToAction: Object.values(getCTAs('website')).concat(getCTAs('on-ad'), getCTAs('messages'), getCTAs('app')),
};
export function isWebUrl(value) {
  try { return /^https?:$/.test(new URL(value).protocol); } catch { return false; }
}
export function isImageSource(value) {
  return isWebUrl(value) || /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=\s]+$/.test(value);
}
export function normalizeData(source = {}, strict = false) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('This file does not contain a campaign.');
  const data = blankCampaign();
  for (const key of Object.keys(data)) {
    const value = source[key];
    if (value === undefined) continue;
    if (Array.isArray(data[key])) continue;
    if (typeof value !== 'string' && typeof value !== 'number') { if (strict) throw new Error(`Invalid field: ${key}`); continue; }
    const text = String(value);
    if (text.length > (key === 'imageUrl' ? 15 * 1024 * 1024 : 24000)) throw new Error(`The ${key} field is too large.`);
    if (enums[key] && !enums[key].includes(text)) { if (strict) throw new Error(`Unsupported option: ${key}`); continue; }
    data[key] = text;
  }
  if (source.imageUrl && !isImageSource(data.imageUrl)) { if (strict) throw new Error('Use an uploaded PNG, JPG, WEBP or GIF, or an HTTP(S) image URL.'); data.imageUrl = ''; }
  data.placements = Array.isArray(source.placements) ? [...new Set(source.placements.filter(p => placements.some(item => item.id === p)))] : data.placements;
  data.formQuestions = Array.isArray(source.formQuestions) ? [...new Set(source.formQuestions.filter(q => typeof q === 'string' && q.length <= 200))].slice(0,8) : data.formQuestions;
  if (Array.isArray(source.carouselCards)) {
    if (source.carouselCards.length > 10) throw new Error('A carousel can contain up to 10 cards.');
    data.carouselCards = source.carouselCards.map((card, index) => {
      if (!card || typeof card !== 'object') throw new Error('Invalid carousel card.');
      const clean = { id: `card-${index}`, imageUrl: '', imageName: '', imageAlt: '', headline: '', websiteUrl: '' };
      for (const key of Object.keys(clean).filter(k => k !== 'id')) {
        if (card[key] !== undefined && typeof card[key] !== 'string') throw new Error('Invalid carousel content.');
        clean[key] = card[key] || '';
        if (clean[key].length > (key === 'imageUrl' ? 15 * 1024 * 1024 : 24000)) throw new Error('Carousel content is too large.');
      }
      if (clean.imageUrl && !isImageSource(clean.imageUrl)) throw new Error('Invalid carousel image.');
      return clean;
    });
  }
  // Old drafts have no conversion-location or goal. Infer a supported path, preserving their copy and images.
  const objective = getObjective(data.campaignObjective);
  if (objective && !objective.destinations.includes(data.destination)) data.destination = data.websiteUrl && objective.destinations.includes('website') ? 'website' : objective.destinations[0];
  const goals = getGoals(data.campaignObjective, data.destination);
  if (!goals.includes(data.performanceGoal)) data.performanceGoal = goals[0] || '';
  if (!getCTAs(data.destination).includes(data.callToAction)) data.callToAction = getCTAs(data.destination)[0];
  if (data.specialCategory !== 'none') { data.ageRange = '18-65+'; data.gender = 'all'; }
  return data;
}
export function migrateWorkspace(saved) {
  if (!saved) return blankWorkspace();
  if (typeof saved !== 'object' || Array.isArray(saved)) throw new Error('This draft does not contain a campaign workspace.');
  const envelope = saved.schemaVersion === 2;
  if (saved.schemaVersion && !envelope) throw new Error('This draft uses a newer or unsupported file format.');
  if (envelope && (!saved.data || typeof saved.data !== 'object' || Array.isArray(saved.data))) throw new Error('This draft is missing campaign data.');
  const base = blankWorkspace();
  base.data = normalizeData(envelope ? saved.data : saved, true);
  if (envelope) {
    base.currentStep = Number.isInteger(saved.currentStep) && saved.currentStep >= 0 && saved.currentStep <= 3 ? saved.currentStep : 0;
    base.events = Array.isArray(saved.events) ? saved.events.slice(-150).filter(e => e && typeof e.at === 'string' && typeof e.text === 'string').map(e => ({ at: e.at.slice(0,80), text: e.text.slice(0,1000) })) : [];
    if (saved.publication && typeof saved.publication.publishedAt === 'string' && saved.publication.data) {
      base.publication = { publishedAt: saved.publication.publishedAt.slice(0,80), paused: saved.publication.paused === true, data: normalizeData(saved.publication.data, true) };
    }
  }
  return base;
}
export function importWorkspace(text) {
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw new Error('Choose a valid campaign JSON file.'); }
  if (!parsed || parsed.format !== 'mark4360-facebook-campaign' || parsed.schemaVersion !== 2) throw new Error('Choose a Facebook Simulator Revamp export (version 2).');
  if (!parsed.workspace || parsed.workspace.schemaVersion !== 2) throw new Error('This export is missing its campaign workspace.');
  return migrateWorkspace(parsed.workspace);
}
export function exportWorkspace(workspace) {
  return JSON.stringify({ format: 'mark4360-facebook-campaign', schemaVersion: 2, simulatorVersion: SIMULATOR_VERSION, exportedAt: new Date().toISOString(), workspace }, null, 2);
}
function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0,10) === value;
}
export function validateCampaign(data) {
  const errors = [];
  const add = (step, field, message) => errors.push({ step, field, message });
  if (!data.campaignName.trim()) add(0, 'campaignName', 'Enter a campaign name.');
  if (!getObjective(data.campaignObjective)) add(0, 'campaignObjective', 'Choose a campaign objective.');
  if (data.spendingLimit && (!Number.isFinite(Number(data.spendingLimit)) || Number(data.spendingLimit) <= 0)) add(0, 'spendingLimit', 'Enter a positive spending limit or leave it blank.');
  if (!data.adSetName.trim()) add(1, 'adSetName', 'Name the ad set.');
  if (!getObjective(data.campaignObjective)?.destinations.includes(data.destination)) add(1, 'destination', 'Choose a supported conversion location.');
  if (!getGoals(data.campaignObjective, data.destination).includes(data.performanceGoal)) add(1, 'performanceGoal', 'Choose a performance goal.');
  if (!Number.isFinite(Number(data.budgetAmount)) || Number(data.budgetAmount) <= 0) add(1, 'budgetAmount', 'Enter a budget greater than zero.');
  if (!validDate(data.startDate)) add(1, 'startDate', 'Enter a valid start date.');
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.startTime)) add(1, 'startTime', 'Enter a valid start time.');
  try { new Intl.DateTimeFormat('en', { timeZone: data.timezone }); } catch { add(1, 'timezone', 'Choose a valid account time zone.'); }
  if (data.budgetType === 'lifetime' && !data.endDate) add(1, 'endDate', 'A lifetime budget needs an end date.');
  if (data.endDate && (!validDate(data.endDate) || data.endDate < data.startDate)) add(1, 'endDate', 'The end date must be valid and on or after the start date.');
  if (!data.locations.trim()) add(1, 'locations', 'Enter at least one target location.');
  if (data.specialCategory !== 'none' && (data.ageRange !== '18-65+' || data.gender !== 'all')) add(1, 'ageRange', 'Use the broad demographic controls for this practice special category.');
  if (data.audienceMode !== 'original' && !data.audienceSource.trim()) add(1, 'audienceSource', 'Describe the audience source. Do not upload customer records.');
  if (data.placementMode === 'manual' && !data.placements.length) add(1, 'placements', 'Select at least one placement.');
  if (!data.adName.trim()) add(2, 'adName', 'Name the ad.');
  if (!data.facebookPage.trim()) add(2, 'facebookPage', 'Enter the Facebook Page identity.');
  if (!data.primaryText.trim()) add(2, 'primaryText', 'Enter the primary text.');
  if (!getCTAs(data.destination).includes(data.callToAction)) add(2, 'callToAction', 'Choose a call to action for this destination.');
  if (data.adFormat === 'single-image' && !isImageSource(data.imageUrl)) add(2, 'imageUrl', 'Upload an image or enter a valid HTTP(S) image URL.');
  if (data.adFormat === 'carousel') {
    if (data.carouselCards.length < 2 || data.carouselCards.length > 10) add(2, 'carouselCards', 'Add between 2 and 10 carousel cards.');
    data.carouselCards.forEach((card, index) => {
      if (!isImageSource(card.imageUrl) || !card.headline.trim()) add(2, 'carouselCards', `Add an image and headline to card ${index + 1}.`);
      if (data.destination === 'website' && !isWebUrl(card.websiteUrl || data.websiteUrl)) add(2, 'carouselCards', `Card ${index + 1} needs a valid website destination.`);
    });
  }
  if (data.destination === 'website') {
    if (!isWebUrl(data.websiteUrl)) add(2, 'websiteUrl', 'Enter a complete HTTP(S) website URL.');
    if (!data.headline.trim() && data.adFormat !== 'carousel') add(2, 'headline', 'Enter a headline for the website ad.');
    if (['sales', 'leads'].includes(data.campaignObjective) && !data.datasetName.trim()) add(1, 'datasetName', 'Name the practice dataset used to measure conversions.');
  }
  if (data.destination === 'app') {
    if (!data.appName.trim()) add(2, 'appName', 'Enter the app name.');
    if (!isWebUrl(data.appUrl)) add(2, 'appUrl', 'Enter a complete HTTP(S) app store URL.');
  }
  if (data.destination === 'messages' && !data.messageGreeting.trim()) add(2, 'messageGreeting', 'Enter the opening message.');
  if (data.destination === 'instant-form') {
    if (!data.formName.trim()) add(2, 'formName', 'Name the instant form.');
    if (!data.formHeadline.trim()) add(2, 'formHeadline', 'Enter the instant form headline.');
    if (!data.formQuestions.length) add(2, 'formQuestions', 'Select at least one question for the form.');
    if (!isWebUrl(data.privacyUrl)) add(2, 'privacyUrl', 'Enter a complete HTTP(S) privacy-policy URL for the practice form.');
  }
  return errors;
}
export function budgetSummary(data) {
  const amount = Number(data.budgetAmount);
  if (!Number.isFinite(amount) || amount <= 0) return 'Set the budget and schedule to see planned spend.';
  const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  let result = data.budgetType === 'daily' ? `${money(amount)} average daily budget` : `${money(amount)} lifetime budget`;
  if (data.endDate && validDate(data.startDate) && validDate(data.endDate) && data.endDate >= data.startDate) {
    const days = Math.round((new Date(`${data.endDate}T12:00Z`) - new Date(`${data.startDate}T12:00Z`)) / 86400000) + 1;
    result += data.budgetType === 'daily' ? ` · ${money(amount * days)} planned across ${days} calendar days` : ` · about ${money(amount / days)} per calendar day across ${days} days`;
  }
  if (Number(data.spendingLimit) > 0) result += ` · campaign cap ${money(Number(data.spendingLimit))}`;
  return result;
}
export function selectedPlacements(data) { return placements.filter(p => data.placementMode === 'advantage' || data.placements.includes(p.id)); }
export function destinationUrl(data) { return data.destination === 'app' ? data.appUrl : data.destination === 'website' ? data.websiteUrl : ''; }
export function trackedUrl(data) {
  const url = destinationUrl(data);
  if (data.destination !== 'website') return url;
  if (!isWebUrl(url)) return url;
  const result = new URL(url);
  new URLSearchParams(data.urlParameters.replace(/^\?/, '')).forEach((value,key) => result.searchParams.set(key,value));
  return result.toString();
}
const documentationFields = ['studentName', 'courseSection', 'assignmentTitle', 'businessGoal', 'strategyDescription', 'budgetRationale', 'creativeRationale', 'measurementPlan', 'revisionNotes'];
export function applyCampaignField(previous, field, value) {
  let data = { ...previous, [field]: value };
  if (field === 'campaignObjective') {
    const objective = getObjective(value);
    const destination = objective?.destinations.includes(data.destination) ? data.destination : objective?.destinations[0] || '';
    data = { ...data, destination, performanceGoal: getGoals(value, destination)[0] || '', callToAction: getCTAs(destination)[0] };
  }
  if (field === 'destination') data = { ...data, performanceGoal: getGoals(data.campaignObjective, value)[0] || '', callToAction: getCTAs(value)[0] };
  if (field === 'specialCategory' && value !== 'none') data = { ...data, ageRange: '18-65+', gender: 'all' };
  if (field === 'placementMode' && value === 'advantage') data.placements = placements.map(placement => placement.id);
  return data;
}
export function publicationSnapshot(data) {
  if (validateCampaign(data).length) return null;
  return { publishedAt: new Date().toISOString(), paused: false, data: structuredClone(data) };
}
export function campaignChanged(data, publication) {
  if (!publication) return false;
  return Object.keys(blankCampaign()).filter(key => !documentationFields.includes(key)).some(key => JSON.stringify(data[key]) !== JSON.stringify(publication.data[key]));
}
