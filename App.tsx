
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Training from './pages/Training';
import Schedule from './pages/Schedule';
import Contacts from './pages/Contacts';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import { BookingProvider } from './context/BookingContext';
import { MembershipProvider } from './context/MembershipContext';
import BookingModal from './components/BookingModal';

const App: React.FC = () => {
  return (
    <BookingProvider>
      <MembershipProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/training" element={<Training />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <BookingModal />
        </Router>
      </MembershipProvider>
    </BookingProvider>
  );
};

export default App;
