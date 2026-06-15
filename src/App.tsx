
import React from 'react';
import './App.css';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './features/hero/Hero';
import { TrustStrip } from './features/trust/TrustStrip';
import { EntityAnswer } from './features/entity/EntityAnswer';
import { ManifestoBlock } from './features/manifesto/ManifestoBlock';
import { CategoryGrid } from './features/categories/CategoryGrid';
import { BestSellers } from './features/bestsellers/BestSellers';
import { FounderStory } from './features/founder/FounderStory';
import { ValueProps } from './features/value/ValueProps';
import { ReviewsWall } from './features/reviews/ReviewsWall';
import { FaqSection } from './features/faq/FaqSection';
import { FinalCta } from './features/cta/FinalCta';
import { Footer } from './components/Footer';

function App() {
  return (
    <>
      <a href="#main" className="kk-skip">Skip to content</a>
      <AnnouncementBar />
      <Header />
      <main id="main">
        <Hero />
        <TrustStrip />
        <EntityAnswer />
        <ManifestoBlock />
        <CategoryGrid />
        <BestSellers />
        <FounderStory />
        <ValueProps />
        <ReviewsWall />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

export default App;
