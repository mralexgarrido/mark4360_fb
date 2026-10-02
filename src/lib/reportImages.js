export async function waitForReportImages(report, timeoutMs = 5000) {
  return Promise.all([...report.querySelectorAll('img')].map(image => {
    if (image.complete) return Promise.resolve(image.naturalWidth > 0);
    return new Promise(resolve => {
      const finish = () => {
        clearTimeout(timer);
        image.removeEventListener('load', finish);
        image.removeEventListener('error', finish);
        resolve(image.complete && image.naturalWidth > 0);
      };
      const timer = setTimeout(finish, timeoutMs);
      image.addEventListener('load', finish, { once: true });
      image.addEventListener('error', finish, { once: true });
    });
  }));
}
