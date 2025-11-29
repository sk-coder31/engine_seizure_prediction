import { useState } from 'react';
import { Wrench, Lock, User, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface LoginPageProps {
  onNavigate: (page: 'home' | 'dashboard', data?: any) => void
}

export default function GarageOwnerLogin({ onNavigate }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('http://localhost:3000/api/login', formData, {
        headers: { 'Content-Type': 'application/json' },
        
    })
    .then((res)=>{
      // alert('Login Successful');
      // send response data up to parent and navigate to dashboard
      console.log(res.data);
      onNavigate('dashboard', res.data);
    }).catch(()=>{
        alert('Login Failed. Please check your credentials.');
    })
    
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-black"></div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>

      <div className="absolute top-1/4 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-red-600/30 to-transparent"></div>
      <div className="absolute top-1/4 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-red-600/30 to-transparent"></div>
      <div className="absolute bottom-1/4 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-red-600/30 to-transparent"></div>
      <div className="absolute bottom-1/4 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-red-600/30 to-transparent"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <button
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="uppercase tracking-wider font-bold text-sm">Back</span>
        </button>

        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
               style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.9))' }}>
            <Wrench className="w-12 h-12 text-black" strokeWidth={3} />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-red-600 to-red-900 tracking-wider mb-2 filter drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]"
              style={{
                textShadow: '0 0 30px rgba(239, 68, 68, 0.5), 0 0 60px rgba(239, 68, 68, 0.3)',
                fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
              }}>
            GARAGE OWNER
          </h1>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-widest"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)',
                fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
              }}>
            LOGIN
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mt-6 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-red-900/30 to-black border-4 border-red-600 p-8 md:p-12 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="block text-red-500 text-sm font-black uppercase tracking-wider mb-3"
                       style={{ textShadow: '0 0 10px rgba(239,68,68,0.5)' }}>
                  <User className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border-2 border-red-600/50 focus:border-red-500 px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 uppercase tracking-wider font-bold"
                  placeholder="YOUR@EMAIL.COM"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-red-500 text-sm font-black uppercase tracking-wider mb-3"
                       style={{ textShadow: '0 0 10px rgba(239,68,68,0.5)' }}>
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-black border-2 border-red-600/50 focus:border-red-500 px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 font-bold"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-black border-2 border-red-600/50 checked:bg-red-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="uppercase tracking-wide font-bold group-hover:text-red-500 transition-colors">
                    Remember Me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-400 uppercase tracking-wide font-bold transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="group relative w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xl py-5 uppercase tracking-widest transition-all duration-300 overflow-hidden border-2 border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10">Login to Dashboard</span>
              </button>

              <div className="text-center pt-6 border-t-2 border-red-600/30">
                <p className="text-gray-400 uppercase tracking-wider font-bold text-sm">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="text-red-500 hover:text-red-400 transition-colors font-black"
                  >
                    Register Now
                  </button>
                </p>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-red-950 border-2 border-red-600 p-4 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <p className="text-red-400 text-xs uppercase tracking-wider font-bold">
                🔒 Secure login • Your data is protected
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-transparent via-red-950 to-transparent px-8 py-4 border-t-2 border-b-2 border-red-600/50">
            <p className="text-gray-500 text-sm uppercase tracking-[0.3em] font-bold">
              Owner Portal Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}