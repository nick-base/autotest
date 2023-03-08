export const getParameterByName = (name, url) => {
  if (typeof window === 'undefined') return '';
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[[]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const getCookieDisabled = () => !!(typeof window === 'undefined' || !navigator.cookieEnabled);

export const isCookieDisabled = getCookieDisabled();
