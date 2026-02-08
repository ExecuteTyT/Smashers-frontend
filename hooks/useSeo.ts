import { useEffect } from 'react';

const SITE_NAME = 'Smashers';
const DEFAULT_OG_IMAGE = '/Gemini_Generated_Image_l5hojql5hojql5ho.png';
const LOCALE = 'ru_RU';

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
  const base = typeof window !== 'undefined' ? window.location.origin : '';
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
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:image', imageUrl, true);
    setMeta('og:url', pageUrl, true);
    setMeta('og:type', 'website', true);
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
