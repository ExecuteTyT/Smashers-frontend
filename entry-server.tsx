/**
 * SSR entry для SSG: рендер приложения в HTML по заданному URL.
 * Без Puppeteer — маппинг URL → страница, StaticRouter только для контекста (Layout, useLocation).
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { MembershipProvider } from './context/MembershipContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import BookingModal from './components/BookingModal';
import Home from './pages/Home';
import Training from './pages/Training';
import Schedule from './pages/Schedule';
import Contacts from './pages/Contacts';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';

const ROUTE_PAGES: Record<string, React.FC> = {
  '/': Home,
  '/training': Training,
  '/schedule': Schedule,
  '/contacts': Contacts,
  '/faq': FAQ,
  '/privacy-policy': PrivacyPolicy,
};

export function render(url: string): string {
  const pathname = (url ?? '').replace(/\?.*$/, '').replace(/\/$/, '') || '/';
  const Page = ROUTE_PAGES[pathname] ?? NotFound;
  const location = { pathname, search: '', hash: '', state: null, key: 'default' };

  return renderToString(
    <React.StrictMode>
      <StaticRouter location={location}>
        <BookingProvider>
          <MembershipProvider>
            <ScrollToTop />
            <Layout>
              <Page />
            </Layout>
            <BookingModal />
          </MembershipProvider>
        </BookingProvider>
      </StaticRouter>
    </React.StrictMode>
  );
}
