import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Phone, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistance } from '../utils/distance';
import { Garage } from '../types/garage';
import 'leaflet/dist/leaflet.css';

interface GarageFinderProps {
  onBack: () => void;
}

const userIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const garageIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const GarageFinder = ({ onBack }: GarageFinderProps) => {
  const { latitude, longitude, error, loading, requestLocation } = useGeolocation();
  const [garages, setGarages] = useState<Garage[]>([]);
  const [searchRadius, setSearchRadius] = useState(10);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    const mockGarages: Garage[] = [
      {
        id: '1',
        owner_name: 'John Smith',
        garage_name: 'Speed Demons Auto',
        phone_number: '+1234567890',
        address: '123 Main St, Downtown',
        latitude: latitude ? latitude + 0.02 : 0,
        longitude: longitude ? longitude + 0.02 : 0,
        services: ['Oil Change', 'Brake Repair', 'Engine Tune-up'],
        working_hours: '9 AM - 6 PM',
        gst_number: 'GST123456',
        daily_visits: 15,
        total_visits: 1250,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        owner_name: 'Mike Johnson',
        garage_name: 'Thunder Motors',
        phone_number: '+1234567891',
        address: '456 Oak Ave, Westside',
        latitude: latitude ? latitude - 0.03 : 0,
        longitude: longitude ? longitude + 0.01 : 0,
        services: ['Tire Service', 'AC Repair', 'Body Work'],
        working_hours: '8 AM - 8 PM',
        daily_visits: 22,
        total_visits: 3400,
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        owner_name: 'David Rodriguez',
        garage_name: 'Iron Horse Garage',
        phone_number: '+1234567892',
        address: '789 Pine Rd, Eastside',
        latitude: latitude ? latitude + 0.01 : 0,
        longitude: longitude ? longitude - 0.02 : 0,
        services: ['Transmission', 'Suspension', 'Exhaust'],
        working_hours: '10 AM - 7 PM',
        gst_number: 'GST789012',
        daily_visits: 18,
        total_visits: 2100,
        created_at: new Date().toISOString(),
      },
    ];

    if (latitude && longitude) {
      const filtered = mockGarages.filter(garage => {
        const distance = calculateDistance(latitude, longitude, garage.latitude, garage.longitude);
        return distance <= searchRadius;
      });
      setGarages(filtered);
    }
  }, [latitude, longitude, searchRadius]);

  const handleRequestLocation = () => {
    setPermissionRequested(true);
    requestLocation();
  };

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
            <MapPin className="w-24 h-24 text-red-500 mx-auto mb-6" strokeWidth={2} />
            <h2 className="text-5xl font-black text-white mb-6 tracking-wider"
                style={{
                  textShadow: '0 0 20px rgba(239,68,68,0.6)',
                  fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                }}>
              LOCATION REQUIRED
            </h2>
            <p className="text-gray-400 mb-8 text-lg uppercase tracking-wide">
              We need your location to find nearby garages
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

  if (!latitude || !longitude) {
    return null;
  }

  const filteredGarages = garages.map(garage => ({
    ...garage,
    distance: calculateDistance(latitude, longitude, garage.latitude, garage.longitude)
  })).sort((a, b) => a.distance - b.distance);

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gradient-to-r from-red-950 to-black border-b-4 border-red-600 p-4 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl font-black text-white tracking-wider"
              style={{
                textShadow: '0 0 15px rgba(239,68,68,0.6)',
                fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
              }}>
            GARAGE FINDER
          </h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-88px)]">
        <div className="w-full md:w-2/5 bg-gradient-to-b from-gray-900 to-black border-r-4 border-red-600 overflow-hidden flex flex-col">
          <div className="p-6 border-b-4 border-red-900">
            <label className="block text-red-500 font-black text-sm mb-3 uppercase tracking-wider">
              Search Radius: {searchRadius} KM
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="w-full h-3 bg-red-950 rounded-lg appearance-none cursor-pointer border-2 border-red-600"
              style={{
                background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${((searchRadius - 1) / 49) * 100}%, #450a0a ${((searchRadius - 1) / 49) * 100}%, #450a0a 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2 font-bold">
              <span>1 KM</span>
              <span>50 KM</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredGarages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 font-bold uppercase tracking-wider">
                  No garages found within {searchRadius}km
                </p>
              </div>
            ) : (
              filteredGarages.map((garage) => (
                <div
                  key={garage.id}
                  onClick={() => setSelectedGarage(garage)}
                  className={`bg-gradient-to-br from-red-950 to-black border-3 ${
                    selectedGarage?.id === garage.id ? 'border-red-500' : 'border-red-900'
                  } p-5 cursor-pointer hover:border-red-600 transition-all duration-300 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-black text-white mb-1 tracking-wide"
                          style={{
                            textShadow: '0 0 10px rgba(239,68,68,0.4)',
                            fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                          }}>
                        {garage.garage_name}
                      </h3>
                      <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">
                        {garage.owner_name}
                      </p>
                    </div>
                    <div className="bg-red-600 px-3 py-1 border-2 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                      <span className="text-white font-black text-lg"
                            style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}>
                        {garage.distance}KM
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="w-4 h-4 text-red-500" />
                      <span className="font-bold">{garage.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="text-sm">{garage.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-bold">{garage.working_hours}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {garage.services.slice(0, 3).map((service, idx) => (
                      <span
                        key={idx}
                        className="bg-black border border-red-800 text-red-400 px-2 py-1 text-xs font-bold uppercase tracking-wide"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t-2 border-red-900 flex justify-between text-xs">
                    <div className="text-gray-400">
                      <span className="font-bold uppercase">Today:</span>
                      <span className="text-red-500 ml-1 font-black">{garage.daily_visits}</span>
                    </div>
                    <div className="text-gray-400">
                      <span className="font-bold uppercase">Total:</span>
                      <span className="text-red-500 ml-1 font-black">{garage.total_visits}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="hidden md:block w-3/5 relative">
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            <Marker position={[latitude, longitude]} icon={userIcon}>
              <Popup>
                <div className="font-bold text-center">
                  <p className="text-blue-600">YOUR LOCATION</p>
                </div>
              </Popup>
            </Marker>

            {filteredGarages.map((garage) => (
              <Marker
                key={garage.id}
                position={[garage.latitude, garage.longitude]}
                icon={garageIcon}
              >
                <Popup>
                  <div className="font-bold">
                    <p className="text-red-600 text-lg">{garage.garage_name}</p>
                    <p className="text-gray-600 text-sm">{garage.owner_name}</p>
                    <p className="text-gray-600 text-sm">{garage.distance}km away</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {selectedGarage && (
              <Polyline
                positions={[
                  [latitude, longitude],
                  [selectedGarage.latitude, selectedGarage.longitude]
                ]}
                color="#dc2626"
                weight={3}
                opacity={0.7}
                dashArray="10, 10"
              />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
