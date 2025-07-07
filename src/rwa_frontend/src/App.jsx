import React from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatsSection from './components/StatsSection'
import FeaturesAssetsSection from './components/FeaturesAssetsSection'
import Footer from './components/Footer'
import CallToActionSection from './components/CallToActionSection'

const App = () => {
  return (
    <div>
        <Navbar/>
        <HeroSection/>
        <StatsSection/>
        <FeaturesAssetsSection/>
        <CallToActionSection />
        <Footer/>
    </div>
  )
}

export default App