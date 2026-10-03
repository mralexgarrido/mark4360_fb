import { useState } from 'react';
import { Globe, Heart, MessageCircle, Share2, ThumbsUp, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useAdCampaign } from '../context/AdCampaignContext';
import { selectedPlacements, destinationUrl, trackedUrl, isImageSource } from '../lib/campaign';
import { ctaLabels, destinationLabels } from '../data/platformOptions';
import PracticeDialog from './PracticeDialog';
export function DestinationPreview({ data }) {
  if (data.destination === 'instant-form') return <div className="destination-form"><span className="eyebrow">Instant form preview</span><p>Form name: {data.formName || 'Not configured'}</p><h3>{data.formHeadline || 'Form headline'}</h3><p className="preserve-lines">{data.formDescription}</p>{data.formQuestions.map(question => <div className="field" key={question}><label>{question}</label><div className="mock-input">Response field</div></div>)}<p className="field-hint">Privacy-policy destination: {data.privacyUrl || 'Not configured'}</p><span className="preview-cta">Submit</span>{data.thankYouMessage && <p>Completion message: {data.thankYouMessage}</p>}<p className="notice">This preview collects no answers and cannot submit a form.</p></div>;
  if (data.destination === 'messages') return <div><span className="eyebrow">{data.messageApp} preview</span><h3>{(data.messageApp === 'Instagram' ? data.instagramAccount || data.facebookPage : data.facebookPage) || 'Business identity'}</h3><div className="message-bubble">{data.messageGreeting || 'Opening message not configured.'}</div><p className="notice">This preview cannot send or receive messages.</p></div>;
  return <div><h3>{data.destination === 'app' ? data.appName || 'App destination' : 'Website destination'}</h3>{data.destination === 'app' && <p>{data.appStore}</p>}<p className="url-output">{trackedUrl(data) || 'Not configured'}</p><p className="notice">Destination settings only. The simulator does not visit or verify this page.</p></div>;
}
export default function AdPreview({ data: suppliedData, placement: suppliedPlacement, interactive = true }) {
  const context = useAdCampaign();
  const data = suppliedData || context.campaignData;
  const [placementId, setPlacementId] = useState('facebook-feed');
  const [cardIndex, setCardIndex] = useState(0);
  const [showDestination, setShowDestination] = useState(false);
  const [expandedCopy, setExpandedCopy] = useState(false);
  const options = selectedPlacements(data);
  const placement = suppliedPlacement || options.find(option => option.id === placementId) || options[0];
  if (!placement) return <p className="notice">Select a placement in the ad set to view the ad.</p>;
  const isInstagram = placement.platform === 'instagram';
  const isStory = placement.shape === 'story';
  const index = Math.min(cardIndex,Math.max(data.carouselCards.length-1,0));
  const card = data.adFormat === 'carousel' ? data.carouselCards[index] : null;
  const source = card?.imageUrl || (data.adFormat === 'single-image' ? data.imageUrl : '');
  const identity = isInstagram ? data.instagramAccount || data.facebookPage || 'Your account' : data.facebookPage || 'Your Page';
  let hostname = '';
  try { hostname = new URL(data.destination === 'website' ? card?.websiteUrl || data.websiteUrl : destinationUrl(data)).hostname; } catch { hostname = destinationLabels[data.destination] || 'Destination'; }
  const headline = card?.headline || data.headline;
  const text = interactive && !expandedCopy && data.primaryText.length > (isStory ? 100 : 170) ? `${data.primaryText.slice(0,isStory ? 100 : 170)}…` : data.primaryText;
  const cta = ctaLabels[data.callToAction] || 'Learn More';
  const showCta = data.callToAction !== 'no-button';
  return <div className="preview-component">
    {interactive && <div className="preview-tools"><label htmlFor="preview-placement">Placement preview</label><select id="preview-placement" value={placement.id} onChange={e => setPlacementId(e.target.value)}>{options.map(option => <option value={option.id} key={option.id}>{option.label}</option>)}</select><p>Illustrative layout. Actual platform rendering may vary.</p></div>}
    <article className={`ad-preview ${isStory ? 'story-preview' : 'feed-preview'} ${isInstagram ? 'instagram-preview' : ''}`} aria-label={`${placement.label} ad preview`}>
      <div className="ad-identity"><div className="identity-avatar" aria-hidden="true">{identity[0].toUpperCase()}</div><div><strong>{identity}</strong><span>Sponsored {isInstagram ? '' : '·'} {!isInstagram && <Globe size={10}/>}</span></div><MoreHorizontal size={20} className="more-icon"/></div>
      {!isStory && !isInstagram && text && <p className="ad-copy">{text}{interactive && text !== data.primaryText && <button type="button" className="see-more" onClick={() => setExpandedCopy(true)}> See more</button>}</p>}
      <div className="ad-image">{isImageSource(source) ? <img key={source} src={source} alt={card?.imageAlt || data.imageAlt || 'Ad creative'} onError={e => { e.currentTarget.hidden = true; const fallback = e.currentTarget.nextElementSibling; if (fallback) fallback.hidden = false; }}/>: <span>Ad media preview</span>}<span key={`fallback-${source}`} className="image-fallback" hidden>Image unavailable. Check or replace the asset.</span>
        {isStory && <div className="story-copy"><strong>{headline}</strong><p>{text}</p></div>}
      </div>
      {data.adFormat === 'carousel' && data.carouselCards.length > 0 && <div className="carousel-controls">{interactive && <button type="button" className="icon-button" aria-label="Previous carousel card" disabled={index === 0} onClick={() => setCardIndex(index-1)}><ChevronLeft size={18}/></button>}<span>Card {index+1} of {data.carouselCards.length}</span>{interactive && <button type="button" className="icon-button" aria-label="Next carousel card" disabled={index >= data.carouselCards.length-1} onClick={() => setCardIndex(index+1)}><ChevronRight size={18}/></button>}</div>}
      {!isStory && isInstagram && <div className="instagram-actions" aria-hidden="true"><Heart size={22}/><MessageCircle size={22}/><Share2 size={22}/></div>}
      {showCta && <div className="ad-link"><div>{!isStory && !isInstagram && <><small>{hostname}</small><strong>{headline || 'Headline preview'}</strong>{data.description && <span>{data.description}</span>}</>}</div>{interactive ? <button type="button" className="preview-cta" onClick={() => setShowDestination(true)}>{cta}</button> : <span className="preview-cta">{cta}</span>}</div>}
      {!isStory && isInstagram && text && <p className="ad-copy"><strong>{identity} </strong>{text}{interactive && text !== data.primaryText && <button type="button" className="see-more" onClick={() => setExpandedCopy(true)}> more</button>}</p>}
      {!isStory && !isInstagram && <div className="social-actions" aria-hidden="true"><span><ThumbsUp size={16}/>Like</span><span><MessageCircle size={16}/>Comment</span><span><Share2 size={16}/>Share</span></div>}
    </article>
    {interactive && showCta && <button type="button" className="text-button destination-link" onClick={() => setShowDestination(true)}>Inspect destination preview</button>}
    {showDestination && <PracticeDialog title="Destination preview" onClose={() => setShowDestination(false)}><DestinationPreview data={card?.websiteUrl && data.destination === 'website' ? {...data, websiteUrl: card.websiteUrl} : data}/></PracticeDialog>}
  </div>;
}
