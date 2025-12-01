import React, { useState, useEffect } from 'react';
import { Job, AdType, ADMOB_IDS, JOB_CATEGORIES } from './types';
import { getJobs, deleteJob } from './services/jobService';
import { JobCard } from './components/JobCard';
import { AdminPanel } from './components/AdminPanel';
import { AdUnit } from './components/AdUnit';
import { Login } from './components/Login';
import { Briefcase, Settings, Search, LogOut, Menu } from 'lucide-react';

// Main Application
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [unlockedSalaries, setUnlockedSalaries] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Ad State
  const [showAppOpenAd, setShowAppOpenAd] = useState(false);
  const [activeAd, setActiveAd] = useState<{type: AdType, id: string} | null>(null);
  const [pendingRewardJobId, setPendingRewardJobId] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for login
    const user = localStorage.getItem('job_app_user');
    if (user) {
      setIsLoggedIn(true);
      if (JSON.parse(user).role === 'admin') setIsAdmin(true);
    }
    
    // Load jobs initially
    setJobs(getJobs());
  }, []);

  // Trigger App Open Ad only after login
  useEffect(() => {
    if (isLoggedIn) {
      setShowAppOpenAd(true);
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = (phone: string, role: 'user' | 'admin') => {
    localStorage.setItem('job_app_user', JSON.stringify({ phone, role }));
    setIsLoggedIn(true);
    if (role === 'admin') setIsAdmin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('job_app_user');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const handleApplyClick = (job: Job) => {
    // Show Interstitial Ad before "navigating" to apply
    setActiveAd({
      type: AdType.INTERSTITIAL,
      id: ADMOB_IDS.INTERSTITIAL
    });
    console.log(`User attempting to apply for ${job.title}`);
  };

  const handleUnlockSalary = (job: Job) => {
    setPendingRewardJobId(job.id);
    setActiveAd({
      type: AdType.REWARDED,
      id: ADMOB_IDS.REWARDED
    });
  };

  const handleAdClose = () => {
    setActiveAd(null);
    setShowAppOpenAd(false);
  };

  const handleAdReward = () => {
    if (pendingRewardJobId) {
      setUnlockedSalaries(prev => [...prev, pendingRewardJobId]);
      setPendingRewardJobId(null);
      alert("Reward Earned! Salary details unlocked.");
    }
    setActiveAd(null);
  };

  // --- Render ---

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (isAdmin) {
    return (
      <AdminPanel 
        onJobAdded={() => setJobs(getJobs())} 
        onExit={() => setIsAdmin(false)} 
      />
    );
  }

  const filteredJobs = selectedCategory === 'All' 
    ? jobs 
    : jobs.filter(job => job.category === selectedCategory);

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* App Open Ad Overlay */}
      {showAppOpenAd && (
        <AdUnit 
          type={AdType.APP_OPEN} 
          adUnitId={ADMOB_IDS.APP_OPEN} 
          onClose={() => setShowAppOpenAd(false)} 
        />
      )}

      {/* Dynamic Ad Overlay (Interstitial / Rewarded) */}
      {activeAd && (
        <AdUnit 
          type={activeAd.type} 
          adUnitId={activeAd.id} 
          onClose={handleAdClose}
          onReward={handleAdReward}
        />
      )}

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <Briefcase className="h-6 w-6" />
            <h1 className="text-xl font-bold tracking-tight">JobConnect</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsAdmin(true)}
              className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              title="Admin Panel"
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* AdMob Banner - Top */}
      <div className="max-w-4xl mx-auto mt-2">
         <AdUnit type={AdType.BANNER} adUnitId={ADMOB_IDS.BANNER} />
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Search Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-10 text-white mb-8 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Find your dream job</h2>
          <p className="text-blue-100 mb-6">Browse openings in {selectedCategory === 'All' ? 'all categories' : selectedCategory}.</p>
          
          <div className="bg-white p-2 rounded-lg flex items-center shadow-md max-w-lg">
            <Search className="text-gray-400 ml-2" size={20} />
            <input 
              type="text" 
              placeholder="Search by title or company..." 
              className="flex-1 px-4 py-2 outline-none text-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {JOB_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Job List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800 text-lg">
              {selectedCategory === 'All' ? 'Latest Jobs' : `${selectedCategory} Jobs`}
            </h3>
            <span className="text-sm text-gray-500">{filteredJobs.length} jobs found</span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
              <Briefcase size={48} className="mx-auto mb-2 opacity-20" />
              <p>No jobs found in this category.</p>
              <button onClick={() => setIsAdmin(true)} className="mt-4 text-blue-600 underline font-medium">Post a job</button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job}
                onViewDetails={handleApplyClick}
                onUnlockSalary={handleUnlockSalary}
                isSalaryUnlocked={unlockedSalaries.includes(job.id)}
              />
            ))
          )}
        </div>
      </main>

       {/* AdMob Banner - Bottom */}
       <div className="max-w-4xl mx-auto mb-8">
         <AdUnit type={AdType.BANNER} adUnitId={ADMOB_IDS.BANNER} />
      </div>

      <footer className="text-center py-6 text-gray-400 text-sm bg-white border-t mt-auto">
        <p>&copy; 2024 JobConnect Services.</p>
        <p className="text-xs mt-1 text-gray-300">Ads by Google AdMob (Simulated for Web)</p>
      </footer>
    </div>
  );
}