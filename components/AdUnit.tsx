import React, { useState, useEffect } from 'react';
import { AdType } from '../types';
import { X, Info, Play, Loader2 } from 'lucide-react';

interface AdUnitProps {
  type: AdType;
  adUnitId: string;
  onClose?: () => void;
  onReward?: () => void; // For Rewarded Ads
}

export const AdUnit: React.FC<AdUnitProps> = ({ type, adUnitId, onClose, onReward }) => {
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    // Simulate network load for ad
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!loading && (type === AdType.INTERSTITIAL || type === AdType.REWARDED || type === AdType.APP_OPEN)) {
      if (timer > 0) {
        const interval = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(interval);
      } else if (timer === 0 && type === AdType.REWARDED && onReward) {
        // Automatically grant reward after timer if simplistic logic
        // Ideally user clicks a button to close and get reward
      }
    }
  }, [loading, timer, type, onReward]);

  const handleClose = () => {
    if (type === AdType.REWARDED && timer > 0) {
      alert("Watch the full video to get the reward!");
      return;
    }
    if (type === AdType.REWARDED && onReward) {
      onReward();
    }
    if (onClose) onClose();
  };

  // Banner Display
  if (type === AdType.BANNER) {
    if (loading) return <div className="h-[50px] w-full bg-gray-200 animate-pulse flex items-center justify-center text-xs text-gray-400">Loading Ad...</div>;
    return (
      <div className="w-full bg-white border-t border-b border-gray-300 h-[60px] flex items-center justify-between px-4 shadow-sm my-2">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 text-[10px] font-bold px-1 rounded text-black">Ad</div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-700">Google AdMob Banner</span>
            <span className="text-[10px] text-gray-500 font-mono">{adUnitId}</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <Info size={14} />
        </button>
      </div>
    );
  }

  // Full Screen Overlays (Interstitial, Rewarded, App Open)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg w-full max-w-sm overflow-hidden shadow-2xl relative">
        {/* Ad Header */}
        <div className="bg-gray-100 p-2 flex justify-between items-center border-b">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
            <Info size={12} /> {type} AD
          </span>
          {timer === 0 ? (
            <button onClick={handleClose} className="bg-gray-200 hover:bg-gray-300 p-1 rounded-full">
              <X size={18} />
            </button>
          ) : (
             <span className="text-xs font-bold text-gray-400">Close in {timer}s</span>
          )}
        </div>

        {/* Ad Content */}
        <div className="p-8 flex flex-col items-center text-center space-y-4">
          {loading ? (
            <Loader2 className="animate-spin text-blue-500" size={48} />
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                <Play fill="currentColor" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Premium Job Alert!</h3>
              <p className="text-sm text-gray-600">
                {type === AdType.REWARDED 
                  ? "Watch this short video to unlock the salary details for this job." 
                  : "Download our mobile app for better experience."}
              </p>
              <div className="bg-gray-50 p-2 rounded border border-dashed border-gray-300 w-full">
                <p className="text-[10px] text-gray-400 font-mono break-all">{adUnitId}</p>
              </div>
            </>
          )}
        </div>

        {/* Ad Footer */}
        <div className="bg-blue-600 p-3 text-center text-white text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors">
          Install Now
        </div>
      </div>
    </div>
  );
};