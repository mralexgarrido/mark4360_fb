export function fileName(name, extension, suffix = '') {
  const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const ending = slug(suffix).slice(0,40);
  const stem = slug(name || 'facebook-campaign') || 'facebook-campaign';
  return `${stem.slice(0,80 - (ending ? ending.length + 1 : 0))}${ending ? `-${ending}` : ''}.${extension}`;
}
export function downloadText(text, filename, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], {type}));
  const link = document.createElement('a'); link.href = url; link.download = filename;
  document.body.appendChild(link); link.click(); link.remove();
  // Large image-rich files need time to begin reading their blob.
  setTimeout(() => URL.revokeObjectURL(url),60000);
}
