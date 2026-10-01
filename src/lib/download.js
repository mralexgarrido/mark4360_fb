export function fileName(name, extension) { return `${(name || 'facebook-campaign').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80) || 'facebook-campaign'}.${extension}`; }
export function downloadText(text, filename, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], {type}));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
}
