// pages/index.tsx - Landing Page (Ana sayfa)
import React from 'react';
import Header from '../../components/Landing/Header';
import Features from '../../components/Landing/Features';
import Testimonials from '../../components/Landing/Testimonials';
import CallToAction from '../../components/Landing/CallToAction';
import Footer from '../../components/Landing/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}
LandingPage.isPublic = true; 
export default LandingPage;