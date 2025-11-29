import { MapPin, Wrench, LogIn } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'finder' | 'register' | 'login') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-black"></div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-16 mt-8">
          <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-red-600 to-red-900 tracking-wider mb-4 filter drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]"
              style={{
                textShadow: '0 0 30px rgba(239, 68, 68, 0.5), 0 0 60px rgba(239, 68, 68, 0.3)',
                fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
              }}>
            GARAGE
          </h1>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-widest mb-2"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.3)',
                fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
              }}>
            LOCATOR
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mt-6 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
          <p className="text-gray-400 mt-4 text-lg tracking-wide uppercase font-bold">
            Find • Fix • Fast
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Find Nearby Garage */}
          <button
            onClick={() => onNavigate('finder')}
            className="group relative bg-gradient-to-br from-red-900 to-black border-4 border-red-600 rounded-none p-12 hover:border-red-500 transition-all duration-300 hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="absolute bottom-0 right-0 w-full h-2 bg-gradient-to-l from-transparent via-red-500 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

            <div className="relative z-10">
              <div className="bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                   style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.9))' }}>
                <MapPin className="w-12 h-12 text-black" strokeWidth={3} />
              </div>
              <h3 className="text-4xl font-black text-white mb-4 tracking-wider group-hover:text-red-400 transition-colors duration-300"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(239,68,68,0.4)',
                    fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                  }}>
                FIND NEARBY
              </h3>
              <h4 className="text-3xl font-black text-red-500 mb-4 tracking-wider"
                  style={{
                    textShadow: '0 0 10px rgba(239,68,68,0.8)',
                    fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                  }}>
                GARAGE
              </h4>
              <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">
                Locate garages in your area
              </p>
            </div>
          </button>

          {/* Login as Garage Owner */}
          <button
            onClick={() => onNavigate('login')}
            className="group relative bg-gradient-to-br from-black to-red-900 border-4 border-red-600 rounded-none p-12 hover:border-red-500 transition-all duration-300 hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tl from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-transparent via-red-500 to-transparent transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

            <div className="relative z-10">
              <div className="bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                   style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.9))' }}>
                <LogIn className="w-12 h-12 text-black" strokeWidth={3} />
              </div>
              <h3 className="text-4xl font-black text-white mb-4 tracking-wider group-hover:text-red-400 transition-colors duration-300"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(239,68,68,0.4)',
                    fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                  }}>
                LOGIN AS
              </h3>
              <h4 className="text-3xl font-black text-red-500 mb-4 tracking-wider"
                  style={{
                    textShadow: '0 0 10px rgba(239,68,68,0.8)',
                    fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                  }}>
                GARAGE OWNER
              </h4>
              <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">
                Access your dashboard
              </p>
            </div>
          </button>

          {/* Register as Garage Owner */}
          <button
            onClick={() => onNavigate('register')}
            className="group relative bg-gradient-to-br from-red-900 to-black border-4 border-red-600 rounded-none p-12 hover:border-red-500 transition-all duration-300 hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="absolute bottom-0 right-0 w-full h-2 bg-gradient-to-l from-transparent via-red-500 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

            <div className="relative z-10">
              <div className="bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                   style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.9))' }}>
                <Wrench className="w-12 h-12 text-black" strokeWidth={3} />
              </div>
              <h3 className="text-4xl font-black text-white mb-4 tracking-wider group-hover:text-red-400 transition-colors duration-300"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(239,68,68,0.4)',
                    fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                  }}>
                REGISTER AS
              </h3>
              <h4 className="text-3xl font-black text-red-500 mb-4 tracking-wider"
                  style={{
                    textShadow: '0 0 10px rgba(239,68,68,0.8)',
                    fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                  }}>
                GARAGE OWNER
              </h4>
              <div className="bg-red-950 border-2 border-red-600 p-3 mt-6 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <p className="text-red-400 text-xs uppercase tracking-wider font-bold">
                  ⚠ Register only inside your garage
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-transparent via-red-950 to-transparent px-8 py-4 border-t-2 border-b-2 border-red-600/50">
            <p className="text-gray-500 text-sm uppercase tracking-[0.3em] font-bold">
              Premium Garage Services Platform
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-red-600/30 to-transparent"></div>
      <div className="absolute top-1/4 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-red-600/30 to-transparent"></div>
      <div className="absolute bottom-1/4 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-red-600/30 to-transparent"></div>
      <div className="absolute bottom-1/4 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-red-600/30 to-transparent"></div>
    </div>
  );
}