'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const images = Array.from({ length: 10 }, (_, i) => ({
  src: `/images/${i + 1}.jpg`,
  alt: `Memory ${i + 1}`,
  id: i + 1,
}));

// Particle component for hero background
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6,
  }));

  return (
    <div className="hero-particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// Music Player Component
function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/music/11.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="music-player" onClick={toggleMusic} role="button" tabIndex={0} aria-label={isPlaying ? 'Pause music' : 'Play music'}>
      <div className="music-icon">
        <div className="music-bars">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`music-bar ${isPlaying ? 'playing' : ''}`} />
          ))}
        </div>
      </div>
      <span className="music-label">{isPlaying ? 'Playing' : 'Play Music'}</span>
    </div>
  );
}

// Lightbox Component
function Lightbox({ imageIndex, onClose, onPrev, onNext }: { imageIndex: number; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>✕</button>
      <button
        className="lightbox-nav lightbox-prev"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        ‹
      </button>
      <img
        src={images[imageIndex].src}
        alt={images[imageIndex].alt}
        className="lightbox-image"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="lightbox-nav lightbox-next"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        ›
      </button>
      <div className="lightbox-counter">
        {imageIndex + 1} / {images.length}
      </div>
    </div>
  );
}

// Gallery Section
function Gallery() {
 const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? 0 : prev === 0 ? images.length - 1 : prev - 1));
  }, []);
  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? 0 : prev === images.length - 1 ? 0 : prev + 1));
  }, []);

  return (
    <section className="gallery-section" id="gallery">
      <div className="section-label">Our Memories</div>
      <h2 className="section-title">Through the Years</h2>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="gallery-item"
            onClick={() => openLightbox(index)}
          >
            <img src={image.src} alt={image.alt} loading="lazy" />
            <span className="gallery-item-number">{image.id}</span>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          imageIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </section>
  );
}

// Letter Section with scroll reveal
function LetterSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll(
      '.letter-paragraph, .letter-heart-divider'
    );
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="letter-section" id="letter" ref={sectionRef}>
      <div className="section-label">A Letter For You</div>
      <div className="letter-container">
        <div className="letter-opening">
          Happy 7 Years &amp; 1 Month, Love
        </div>

        <p className="letter-paragraph tagalog">
          Gusto ko munang magsimula sa simpleng thank you — thank you sa lahat ng inilalaan mo para sa akin. Sa oras mo, sa pag-intindi mo, sa sakripisyo mo, at sa pagmamahal na patuloy mong ibinibigay kahit na dumaan tayo sa napakaraming pagsubok. Hindi naging madali ang pitong taon at isang buwan na pinagsamahan natin. Marami tayong napagdaanan, mga masasayang alaala, mga pangarap na sabay nating binuo, pero pati na rin ang mga pagsubok, pagkukulang, at mga pagkakataon na nasaktan kita.
        </p>

        <div className="letter-heart-divider">
          <div className="heart-line" />
          <span className="heart-icon">♥</span>
          <div className="heart-line" />
        </div>

        <p className="letter-paragraph">
          I know that in many of those moments, you were the one who endured more. You were the one who kept understanding even when it was already difficult for you. I know that there were times when I hurt you deeply because of my mistakes, and I also know that some of that pain is still in your heart until now. Honestly, there are moments when I feel like I am no longer deserving of the love that you continue to give me. Yet despite everything that has happened, you still chose to stay. You still chose to love me, and that is something I will never take for granted for the rest of my life.
        </p>

        <p className="letter-paragraph">
          I want you to know that I truly and deeply love you. Not just because we have been together for a long time, but because you are the person my heart continues to choose every single day. You have been with me through so many seasons of my life, when I was still dreaming about my future, when I was starting to build my goals, and even now as I continue to work hard to create a better life. Having you beside me through all those moments means more to me than words can ever fully express.
        </p>

        <div className="letter-heart-divider">
          <div className="heart-line" />
          <span className="heart-icon">♥</span>
          <div className="heart-line" />
        </div>

        <p className="letter-paragraph">
          I may not know when your heart will completely heal from the pain that I caused. I know healing takes time, and I understand that it cannot happen overnight. But I sincerely hope and pray that through God&apos;s mercy and guidance, your heart will slowly find peace again. I promise to continue doing my best to become a better person and a better partner for you, someone who deserves the love that you have continued to give me despite everything.
        </p>

        <p className="letter-paragraph tagalog">
          Marami pa akong pangarap para sa atin. Pangarap ko na balang araw, magkaroon tayo ng sarili nating pamilya, isang tahanan na puno ng pagmamahal, respeto, at pagkakaunawaan. Isang buhay na sabay nating bubuuin, sabay nating pagdaraanan ang lahat ng saya at hirap, at sabay nating haharapin ang hinaharap. Nawa&apos;y ipagkaloob sa atin iyon sa tamang panahon, at nawa&apos;y patuloy nating panghawakan ang pagmamahal natin sa isa&apos;t isa habang tumatagal.
        </p>

        <div className="letter-heart-divider">
          <div className="heart-line" />
          <span className="heart-icon">♥</span>
          <div className="heart-line" />
        </div>

        <p className="letter-paragraph">
          Through all these years, you are still the one I choose. You are still the one I love, and you are still the person I want to spend my future with. I love you so much, my love. Thank you for everything.
        </p>

        <div className="letter-closing">
          <p className="letter-closing-text">
            With all my love, today and always
          </p>
          <div className="letter-signature">Forever Yours</div>
        </div>
      </div>
    </section>
  );
}

// Main Page
export default function Home() {
  const [entered, setEntered] = useState(false);
  const audioRef = useRef(null);

  const handleEnter = () => {
    setEntered(true);
  };

  return (
    <main>
      {/* Entrance Overlay */}
      <div className={`entrance-overlay ${entered ? 'hidden' : ''}`}>
        <div className="entrance-heart">♥</div>
        <div className="entrance-text">For You, My Love</div>
        <button className="entrance-button" onClick={handleEnter}>
          Open My Heart
        </button>
      </div>

      {/* Music Player */}
      {entered && <MusicPlayer />}

      {/* Hero Section */}
      <section className="hero" id="hero">
        <Particles />
        <div className="hero-content">
          <div className="hero-eyebrow">A Love Letter</div>
          <h1 className="hero-title">7 Years &amp; 1 Month</h1>
          <p className="hero-subtitle">of loving you, choosing you, and growing with you</p>
          <div className="hero-divider" />
          <div className="hero-date">I love you so much, Love!</div>
        </div>
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll Down</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* Gallery */}
      <Gallery />

      {/* Love Letter */}
      <LetterSection />

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">Made with love, for you</p>
        <div className="footer-hearts">♥ ♥ ♥</div>
      </footer>
    </main>
  );
}
