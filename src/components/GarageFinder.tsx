import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Phone, MapPin, Clock, ArrowLeft, Lock, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

interface GarageFinderProps {
  onBack: () => void;
}

interface UseGeolocationReturn {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  requestLocation: () => void;
}

// Geolocation hook
const useGeolocation = (): UseGeolocationReturn => {
  const [state, setState] = useState<{
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
  }>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false
  });

  const requestLocation = () => {
    setState(prev => ({ ...prev, loading: true }));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
            loading: false
          });
        },
        (error) => {
          setState(prev => ({
            ...prev,
            error: error.message,
            loading: false
          }));
        }
      );
    } else {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false
      }));
    }
  };

  return { ...state, requestLocation };
};

// Distance calculator
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return parseFloat((R * c).toFixed(1));
};

interface Garage {
  id?: string;
  key?: string;
  garage_name: string;
  owner_name: string;
  phone_number: string;
  address: string;
  working_hours: string;
  latitude: number;
  longitude: number;
  daily_visits: number;
  total_visits: number;
  distance?: number;
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

// Component to update map center
function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

export const GarageFinder = ({ onBack }: GarageFinderProps) => {
  const { latitude, longitude, error, loading, requestLocation } = useGeolocation();
  const [garages, setGarages] = useState<Garage[]>([]);
  const [searchRadius, setSearchRadius] = useState(10);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [lockedGarage, setLockedGarage] = useState<Garage | null>(null);
  const [isRinging, setIsRinging] = useState(false);
  
  const garages_service: string[] = [
    "OIL CHANGE",
    "TIRE REPAIR",
    "BRAKE SERVICE",
  ];
  const [permissionRequested, setPermissionRequested] = useState(false);

  // Helper function to get garage identifier (key or id)
  const getGarageId = (garage: Garage): string => {
    return (garage as any).key || garage.id || (garage as any)._id || (garage as any).garage_id || '';
  };

  useEffect(() => {
    if (!latitude || !longitude) return;

    let cancelled = false;

    const fetchNearby = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/find-nearby/${latitude}/${longitude}/${searchRadius}`,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        
        console.log('API response:', response.data.data);
        const data = response.data?.data;
        
        if (!cancelled && data) {
          // Log the first garage to see its structure
          if (data.length > 0) {
            console.log('Sample garage object from API:', data[0]);
            console.log('Garage ID field:', data[0].id, data[0]._id, data[0].garage_id);
          }
          setGarages(data);
        }
      } catch (err) {
        console.error('Error fetching nearby garages:', err);
        if (!cancelled) {
          setGarages([]);
        }
      }
    };

    fetchNearby();

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, searchRadius]);

  const handleRequestLocation = () => {
    setPermissionRequested(true);
    requestLocation();
  };

  const handleLockGarage = () => {
    if (selectedGarage) {
      // Extract garage key - the API returns 'key' field
      const garageKey = getGarageId(selectedGarage);
      
      if (!garageKey) {
        console.error("Garage key is undefined! Full garage object:", JSON.stringify(selectedGarage, null, 2));
        alert("Error: Garage key is missing. Please select a garage again.");
        return;
      }

      setLockedGarage(selectedGarage);
      
      // Send ONLY the garageId key for Socket.IO notification
      const payload = {
        garageId: garageKey
      };
      
      console.log("Sending notification with garageId key:", garageKey);
      
      axios.post(
        "http://localhost:3000/notify",
        payload,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      ).then((res) => {
        console.log("Notification response:", res.data);
        console.log("Garage locked successfully");
      }).catch((err) => {
        console.error("Error locking garage:", err);
        if (err.response) {
          console.error("Error response data:", err.response.data);
          console.error("Error response status:", err.response.status);
        }
        alert("Failed to notify garage. Check console for details.");
      });
    }
  };

  const handleCall = (phoneNumber: string) => {
    setIsRinging(true);
    setTimeout(() => setIsRinging(false), 2000);
    window.location.href = `tel:${phoneNumber}`;
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

  if (!latitude || !longitude) return null;

  const displayGarages = lockedGarage ? [lockedGarage] : garages;
  const filteredGarages = displayGarages.map(garage => ({
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
          <div className="text-center">
            <h1 className="text-4xl font-black text-white tracking-wider"
                style={{
                  textShadow: '0 0 15px rgba(239,68,68,0.6)',
                  fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                }}>
              GARAGE FINDER
            </h1>
            {lockedGarage && (
              <p className="text-green-400 mt-1 font-bold uppercase tracking-wider text-sm">
                <Lock className="inline w-4 h-4 mr-1" />
                Garage Locked
              </p>
            )}
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-88px)]">
        <div className="w-full md:w-2/5 bg-gradient-to-b from-gray-900 to-black border-r-4 border-red-600 overflow-hidden flex flex-col">
          {!lockedGarage && (
            <div className="p-6 border-b-4 border-red-900">
              <label className="block text-red-500 font-black text-sm mb-3 uppercase tracking-wider">
                Search Radius: {searchRadius} KM
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="w-full h-3 bg-red-950 rounded-lg appearance-none cursor-pointer border-2 border-red-600"
                style={{
                  background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${((searchRadius - 1) / 99) * 100}%, #450a0a ${((searchRadius - 1) / 99) * 100}%, #450a0a 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-bold">
                <span>1 KM</span>
                <span>100 KM</span>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredGarages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 font-bold uppercase tracking-wider">
                  No garages found within {searchRadius}km
                </p>
              </div>
            ) : (
              filteredGarages.map((garage) => {
                const garageId = getGarageId(garage);
                const selectedId = selectedGarage ? getGarageId(selectedGarage) : null;
                return (
                <div
                  key={garageId}
                  onClick={() => !lockedGarage && setSelectedGarage(garage)}
                  className={`bg-gradient-to-br from-red-950 to-black border-3 ${
                    selectedId === garageId ? 'border-red-500' : 'border-red-900'
                  } ${lockedGarage ? '' : 'cursor-pointer hover:border-red-600'} p-5 transition-all duration-300 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]`}
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(garage.phone_number);
                        }}
                        className="flex items-center gap-2 hover:text-green-400 transition-colors"
                      >
                        <Phone className={`w-4 h-4 text-red-500 ${isRinging ? 'animate-bounce' : ''}`} />
                        <span className="font-bold">{garage.phone_number}</span>
                      </button>
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
                    {garages_service.map((service, idx) => (
                      <span
                        key={idx}
                        className="bg-black border border-red-800 text-red-400 px-2 py-1 text-xs font-bold uppercase tracking-wide"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t-2 border-red-900 flex justify-between text-xs mb-4">
                    <div className="text-gray-400">
                      <span className="font-bold uppercase">Today:</span>
                      <span className="text-red-500 ml-1 font-black">{garage.daily_visits}</span>
                    </div>
                    <div className="text-gray-400">
                      <span className="font-bold uppercase">Total:</span>
                      <span className="text-red-500 ml-1 font-black">{garage.total_visits}</span>
                    </div>
                  </div>

                  {selectedId === garageId && !lockedGarage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLockGarage();
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-lg py-3 tracking-wider uppercase transition-all duration-300 border-2 border-green-500 flex items-center justify-center gap-2"
                      style={{
                        fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif',
                        boxShadow: '0 0 20px rgba(34,197,94,0.6)',
                        textShadow: '0 0 10px rgba(34,197,94,0.8)'
                      }}
                    >
                      <Lock className="w-5 h-5" />
                      LOCK THE GARAGE
                    </button>
                  )}

                  {lockedGarage && (
                    <div className="space-y-2">
                      <div className="bg-green-600 text-white font-black text-center py-2 border-2 border-green-500 flex items-center justify-center gap-2"
                           style={{
                             fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif',
                             boxShadow: '0 0 20px rgba(34,197,94,0.6)'
                           }}>
                        <Navigation className="w-5 h-5 animate-pulse" />
                        NAVIGATING TO GARAGE
                      </div>
                    </div>
                  )}
                </div>
                );
              })
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
            {lockedGarage && (
              <ChangeMapView center={[(latitude + lockedGarage.latitude) / 2, (longitude + lockedGarage.longitude) / 2]} />
            )}
            
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
                key={getGarageId(garage)}
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

            {(selectedGarage || lockedGarage) && (
              <Polyline
                positions={[
                  [latitude, longitude],
                  [(lockedGarage || selectedGarage)!.latitude, (lockedGarage || selectedGarage)!.longitude]
                ]}
                color={lockedGarage ? "#22c55e" : "#dc2626"}
                weight={4}
                opacity={0.8}
                dashArray={lockedGarage ? undefined : "10, 10"}
              />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};