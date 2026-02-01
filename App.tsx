
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Training from './pages/Training';
import Schedule from './pages/Schedule';
import Contacts from './pages/Contacts';
import FAQ from './pages/FAQ';
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
            </Routes>
          </Layout>
          <BookingModal />
        </Router>
      </MembershipProvider>
    </BookingProvider>
  );
};

export default App;
