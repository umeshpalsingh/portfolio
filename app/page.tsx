import Techstack from '../components/Techstack';
import Interests from '../components/Interests';
import Now from '../components/Now';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Journey from '../components/Journey';
import Projects from '../components/Projects';
import Connect from '../components/Connect';
import UIClient from '../components/UIClient';
import ScrollObserver from '../components/ScrollObserver';
import Toast from '../components/Toast';
import Play from '../components/Play';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Umesh Pal Singh',
  url: 'https://umeshpalsingh.vercel.app',
  jobTitle: 'Full-Stack Developer',
  description: 'Developer, dreamer, and full-time human based in Noida, India.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Noida',
    addressCountry: 'IN',
  },
  knowsAbout: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'PostgreSQL'],
};

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Skip to main content for accessibility */}
      <a href="#about" className="skip-link">Skip to main content</a>

      <UIClient />
      <ScrollObserver />
      
      <Header />

      <main id="main-content">
        <Hero />
        <About />
        <Gallery />
        <Journey />
        <Projects />
        <Techstack />
        <Interests />
        <Now />
        <Play />
        <Connect />
      </main>

      <Footer />

      <Toast />
    </>
  );
}
