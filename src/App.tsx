import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AnnouncementBar from './components/layout/AnnouncementBar';
import CategoryNav from './components/layout/CategoryNav';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LoadingScreen from './components/common/LoadingScreen';
import { useCatalogue } from './hooks/useCatalogue';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySlug, setCategorySlug] = useState<string | null>(null);

  const catalogue = useCatalogue();

  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategorySlug(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-onyx-950">
      {showIntro && <LoadingScreen />}

      <AnnouncementBar />
      
