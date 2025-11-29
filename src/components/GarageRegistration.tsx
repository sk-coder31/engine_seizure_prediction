import { useState } from 'react';
import { ArrowLeft, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

interface GarageRegistrationProps {
  onBack: () => void;
}

const serviceOptions = [
  'Oil Change',
  'Brake Repair',
  'Engine Tune-up',
  'Tire Service',
  'AC Repair',
  'Body Work',
  'Transmission',
  'Suspension',
  'Exhaust',
  'Electrical',
  'Painting',
  'Detailing',
];

export const GarageRegistration = ({ onBack }: GarageRegistrationProps) => {
  const { latitude, longitude, error, loading, requestLocation } = useGeolocation();
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    garageName: '',
    ownerName: '',
    phoneNumber: '',
    services: [] as string[],
    workingHours: '',
    gstNumber: '',
  });

  const [registeredData, setRegisteredData] = useState({
    dailyVisits: 0,
    totalVisits: 0,
    incomingUsers: 0,
  });

  const handleRequestLocation = () => {
    setPermissionRequested(true);
    requestLocation();
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
    setRegisteredData({
      dailyVisits: 0,
      totalVisits: 0,
      incomingUsers: Math.floor(Math.random() * 5),
    });

    setInterval(() => {
      setRegisteredData(prev => ({
        dailyVisits: prev.dailyVisits + Math.floor(Math.random() * 2),
        totalVisits: prev.totalVisits + Math.floor(Math.random() * 2),
        incomingUsers: Math.floor(Math.random() * 8),
      }));
    }, 5000);
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="container mx-auto max-w-4xl">
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="bg-gradient-to-br from-red-900 to-black border-4 border-red-600 p-8 mb-8 text-center shadow-[0_0_40px_rgba(239,68,68,0.5)]">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-5xl font-black text-white mb-4 tracking-wider"
                style={{
                  textShadow: '0 0 20px rgba(239,68,68,0.6)',
                  fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                }}>
              REGISTRATION SUCCESSFUL
            </h2>
            <p className="text-gray-400 text-lg uppercase tracking-wide">
              Your garage is now live on the platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-black to-red-950 border-4 border-red-900 p-6 relative overflow-hidden group hover:border-red-600 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>

              <div className="relative z-10">
                <p className="text-red-500 font-black text-sm uppercase tracking-widest mb-2">
                  Daily Visits
                </p>
                <p className="text-6xl font-black text-white mb-2"
                   style={{
                     textShadow: '0 0 20px rgba(239,68,68,0.6)',
                     fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                   }}>
                  {registeredData.dailyVisits}
                </p>
                <div className="h-1 w-16 bg-gradient-to-r from-red-600 to-transparent mt-2"></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-black to-red-950 border-4 border-red-900 p-6 relative overflow-hidden group hover:border-red-600 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>

              <div className="relative z-10">
                <p className="text-red-500 font-black text-sm uppercase tracking-widest mb-2">
                  Total Visits
                </p>
                <p className="text-6xl font-black text-white mb-2"
                   style={{
                     textShadow: '0 0 20px rgba(239,68,68,0.6)',
                     fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                   }}>
                  {registeredData.totalVisits}
                </p>
                <div className="h-1 w-16 bg-gradient-to-r from-red-600 to-transparent mt-2"></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-950 to-black border-4 border-red-600 p-6 relative overflow-hidden animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>

              <div className="relative z-10">
                <p className="text-red-400 font-black text-sm uppercase tracking-widest mb-2">
                  Incoming Users
                </p>
                <p className="text-6xl font-black text-red-500 mb-2"
                   style={{
                     textShadow: '0 0 25px rgba(239,68,68,0.8)',
                     fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                   }}>
                  {registeredData.incomingUsers}
                </p>
                <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-transparent mt-2"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-transparent via-red-950 to-transparent p-6 border-t-2 border-b-2 border-red-600/50">
            <div className="text-center">
              <p className="text-gray-400 uppercase tracking-wider font-bold mb-2">Garage Details</p>
              <h3 className="text-3xl font-black text-white mb-2 tracking-wider"
                  style={{
                    textShadow: '0 0 15px rgba(239,68,68,0.5)',
                    fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                  }}>
                {formData.garageName}
              </h3>
              <p className="text-red-500 font-bold text-lg">{formData.ownerName}</p>
              <p className="text-gray-500 text-sm mt-2">{formData.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!permissionRequested) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-gradient-to-br from-red-900 to-black border-4 border-red-600 p-12 text-center shadow-[0_0_40px_rgba(239,68,68,0.4)]">
            <AlertTriangle className="w-24 h-24 text-red-500 mx-auto mb-6 animate-pulse" strokeWidth={2} />
            <h2 className="text-5xl font-black text-white mb-6 tracking-wider"
                style={{
                  textShadow: '0 0 20px rgba(239,68,68,0.6)',
                  fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                }}>
              LOCATION REQUIRED
            </h2>
            <div className="bg-red-950 border-2 border-red-600 p-4 mb-8">
              <p className="text-red-400 font-bold uppercase tracking-wide">
                ⚠ Make sure you are inside your garage
              </p>
            </div>
            <p className="text-gray-400 mb-8 text-lg uppercase tracking-wide">
              Accurate location ensures customers find you easily
            </p>
            <button
              onClick={handleRequestLocation}
              className="bg-red-600 hover:bg-red-700 text-white font-black text-xl px-12 py-4 tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] border-2 border-red-500"
              style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
            >
              ALLOW LOCATION ACCESS
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-red-500 text-xl font-black uppercase tracking-wider"
             style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}>
            LOCATING...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="bg-gradient-to-br from-red-900 to-black border-4 border-red-600 p-12 text-center">
            <h2 className="text-4xl font-black text-red-500 mb-4 tracking-wider"
                style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}>
              ERROR
            </h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={handleRequestLocation}
              className="bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3 tracking-wider uppercase"
              style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-gradient-to-br from-red-900 to-black border-4 border-red-600 p-8 mb-8 shadow-[0_0_40px_rgba(239,68,68,0.5)]">
          <h1 className="text-5xl font-black text-white text-center mb-4 tracking-wider"
              style={{
                textShadow: '0 0 20px rgba(239,68,68,0.6)',
                fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
              }}>
            GARAGE REGISTRATION
          </h1>
          <div className="bg-red-950 border-2 border-red-600 p-3 mt-4">
            <p className="text-red-400 text-sm uppercase tracking-wide font-bold text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Register only when inside your garage location
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-br from-black to-red-950 border-3 border-red-900 p-6">
            <label className="block text-red-500 font-black text-sm mb-2 uppercase tracking-widest">
              Garage Name *
            </label>
            <input
              type="text"
              required
              value={formData.garageName}
              onChange={(e) => setFormData({ ...formData, garageName: e.target.value })}
              className="w-full bg-black border-2 border-red-900 text-white px-4 py-3 focus:border-red-600 focus:outline-none font-bold tracking-wide"
              placeholder="Enter garage name"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-black to-red-950 border-3 border-red-900 p-6">
              <label className="block text-red-500 font-black text-sm mb-2 uppercase tracking-widest">
                Owner Name *
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full bg-black border-2 border-red-900 text-white px-4 py-3 focus:border-red-600 focus:outline-none font-bold"
                placeholder="Enter your name"
              />
            </div>

            <div className="bg-gradient-to-br from-black to-red-950 border-3 border-red-900 p-6">
              <label className="block text-red-500 font-black text-sm mb-2 uppercase tracking-widest">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full bg-black border-2 border-red-900 text-white px-4 py-3 focus:border-red-600 focus:outline-none font-bold"
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-950 to-black border-3 border-red-600 p-6 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-red-500" />
              <label className="text-red-500 font-black text-sm uppercase tracking-widest">
                Auto-Detected Location
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black border-2 border-red-900 p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Latitude</p>
                <p className="text-white font-black text-lg">{latitude?.toFixed(6)}</p>
              </div>
              <div className="bg-black border-2 border-red-900 p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Longitude</p>
                <p className="text-white font-black text-lg">{longitude?.toFixed(6)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-black to-red-950 border-3 border-red-900 p-6">
            <label className="block text-red-500 font-black text-sm mb-4 uppercase tracking-widest">
              Services Offered *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {serviceOptions.map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => handleServiceToggle(service)}
                  className={`px-4 py-3 border-2 font-bold text-sm uppercase tracking-wide transition-all duration-300 ${
                    formData.services.includes(service)
                      ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                      : 'bg-black border-red-900 text-gray-400 hover:border-red-700'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-black to-red-950 border-3 border-red-900 p-6">
              <label className="block text-red-500 font-black text-sm mb-2 uppercase tracking-widest">
                Working Hours *
              </label>
              <input
                type="text"
                required
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full bg-black border-2 border-red-900 text-white px-4 py-3 focus:border-red-600 focus:outline-none font-bold"
                placeholder="9 AM - 6 PM"
              />
            </div>

            <div className="bg-gradient-to-br from-black to-red-950 border-3 border-red-900 p-6">
              <label className="block text-red-500 font-black text-sm mb-2 uppercase tracking-widest">
                GST Number (Optional)
              </label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full bg-black border-2 border-red-900 text-white px-4 py-3 focus:border-red-600 focus:outline-none font-bold"
                placeholder="GST123456789"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={formData.services.length === 0}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-700 disabled:to-gray-800 text-white font-black text-2xl py-5 tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:shadow-[0_0_40px_rgba(239,68,68,0.8)] border-3 border-red-500 disabled:border-gray-600"
            style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
          >
            REGISTER GARAGE
          </button>
        </form>
      </div>
    </div>
  );
};
