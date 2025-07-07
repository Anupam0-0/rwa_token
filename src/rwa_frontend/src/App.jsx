import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom';
import Marketplace from './pages/Marketplace';
import TokenizeAsset from './pages/TokenizeAsset';
import Portfolio from './pages/Portfolio';
import Trading from './pages/Trading';
import NotFound from './pages/NotFound';
import AssetDetail from './pages/AssetDetail';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FeaturesAssetsSection from './components/FeaturesAssetsSection';
import CallToActionSection from './components/CallToActionSection';
import Footer from './components/Footer';

const Home = () => (
  <>
    <HeroSection />
    <StatsSection />
    <FeaturesAssetsSection />
    <CallToActionSection />
    <Footer />
  </>
);

const App = () => {
  return (
    <div>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/tokenize" element={<TokenizeAsset />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/asset/:id" element={<AssetDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
  )
}

export default App