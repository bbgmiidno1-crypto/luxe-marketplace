import { Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AnnouncementBar from './components/layout/AnnouncementBar';
import CategoryNav from './components/layout/CategoryNav';
import HomePage from './pages/HomePage';
import LoadingScreen from './components/common/LoadingScreen';
import { useEffect, useState } from 'react';

export default function App() {
  // Short, non-blocking intro. It never blocks navigation and
  // is dismissed automatically. Real data-loading states replace
  // this in a later part.
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-onyx-950">
      {showIntro && <LoadingScreen />}
      <AnnouncementBar />
      <Navbar />
      <CategoryNav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-3xl px-4 py-24 text-center">
                <p className="font-display text-4xl text-gold-400">Page not found</p>
                <p className="mt-3 text-ivory-400">This page will be built in a later part.</p>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
