import React, { useState } from 'react';
import { Smartphone, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (phone: string, role: 'user' | 'admin') => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      alert("Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    // Simulate API call - Reduced delay to 50ms for "immediate" feel
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      // In a real app, this would be sent via SMS.
      alert(`JobConnect Verification Code: 1234`); 
    }, 50); 
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      if (otp === '1234') {
        // Simple admin check for demo purposes (if phone contains 000)
        const role = phone.includes('000') ? 'admin' : 'user';
        onLoginSuccess(phone, role);
      } else {
        alert("Invalid OTP. Try 1234");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-8 text-center text-white">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone size={32} />
          </div>
          <h1 className="text-2xl font-bold">Welcome to JobConnect</h1>
          <p className="text-blue-100 mt-2">Sign in to find your dream job</p>
        </div>

        <div className="p-8">
          {step === 'phone' ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+880</span>
                  <input 
                    type="tel"
                    className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="1712345678"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Use <span className="font-mono bg-gray-200 px-1 rounded">000</span> in number for Admin access.
                </p>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Get Verification Code <ArrowRight size={20} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Enter the code sent to +880 {phone}</p>
                <div className="flex flex-col items-center">
                   <input 
                    type="text"
                    className="w-full text-center text-2xl tracking-[1em] font-bold py-3 border-b-2 border-gray-300 focus:border-blue-600 outline-none transition-all"
                    placeholder="••••"
                    maxLength={4}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    autoFocus
                  />
                  <p className="text-xs text-blue-600 mt-2 font-medium">Hint: Code is 1234</p>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify & Login"}
              </button>
              <button 
                type="button" 
                onClick={() => setStep('phone')}
                className="w-full text-gray-500 text-sm hover:text-gray-700"
              >
                Change Number
              </button>
            </form>
          )}
        </div>
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
           Protected by Google ReCAPTCHA (Simulated)
        </div>
      </div>
    </div>
  );
};