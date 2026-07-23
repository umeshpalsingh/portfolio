import dynamic from 'next/dynamic';
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
import Guestbook from '../components/Guestbook';

export default function Home() {
  return (
    <>
      <UIClient />
      <ScrollObserver />
      
      <Header />

      <main>
        <Hero />
        <About />
        <Gallery />
        <Journey />
        <Projects />
        <Techstack />
        <Interests />
        <Now />
        <Play />
        <Guestbook />
        <Connect />
      </main>

      <Footer />

      <Toast />
    </>
  );
}
