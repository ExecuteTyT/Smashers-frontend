import { useEffect } from 'react';

const SITE_NAME = 'Smashers';
const DEFAULT_OG_IMAGE = '/Gemini_Generated_Image_l5hojql5hojql5ho.png';
const LOCALE = 'ru_RU';

const getSiteOrigin = (): string => {
  if (typeof window !== 'undefined') {
    const envUrl = (import.meta as unknown as { env?: { VITE_SITE_URL?: string } }).env?.VITE_SITE_URL;
    if (envUrl) return envUrl.replace(/\/$/, '');
    return window.location.origin;
  }
  const envUrl = (import.meta as unknown as { env?: { VITE_SITE_URL?: string } }).env?.VITE_SITE_URL;
  return (envUrl && String(envUrl).replace(/\/$/, '')) || '';
};

export interface SeoOptions {
  /** Page title (browser tab). Will be suffixed with " | Smashers" if not already containing site name */
  title: string;
  /** Meta description for search and social */
  description: string;
  /** OG/Twitter image path (relative, e.g. "/image.png") or full URL. Default: club image */
  image?: string;
  /** If true, add robots noindex,nofollow (e.g. for 404) */
  noIndex?: boolean;
}

function getAbsoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  const base = getSiteOrigin();
  return pathOrUrl.startsWith('/') ? base + pathOrUrl : base + '/' + pathOrUrl;
}

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSeo({ title, description, image = DEFAULT_OG_IMAGE, noIndex = false }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta('description', description);

    const imageUrl = getAbsoluteUrl(image);
    const origin = getSiteOrigin();
    const pathPart = typeof window !== 'undefined'
      ? window.location.pathname + window.location.search + window.location.hash
      : '/';
    const pageUrl = origin + (pathPart || '/');

    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:image', imageUrl, true);
    setMeta('og:url', pageUrl, true);
    setMeta('og:type', 'website', true);
    // Canonical URL for search engines
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);
    setMeta('og:locale', LOCALE, true);
    setMeta('og:site_name', SITE_NAME, true);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', imageUrl);

    if (noIndex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow');
    }
  }, [title, description, image, noIndex]);
}
