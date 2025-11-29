import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

export default function GarageStatsPage(garageData: any) {
  console.log(garageData);
  const [registeredData, setRegisteredData] = useState({
    dailyVisits: 0,
    totalVisits: 0,
    incomingUsers: 0,
  });
  const [socket, setSocket] = useState<Socket | null>(null);
  const previousCountRef = useRef(registeredData.incomingUsers);
  
  const [garageInfo] = useState({
    garageName: garageData?.garage?.garage_name||"Hello",
    ownerName: garageData?.garage?.owner_name||"",
    phoneNumber: garageData?.garage?.phone_number||"",
    address: garageData?.garage?.address||"",
  });
  const [showIncomingAnimation, setShowIncomingAnimation] = useState(false);

  // Test function to simulate incoming user
  const simulateIncomingUser = () => {
    setShowIncomingAnimation(true);
    setTimeout(() => {
      setRegisteredData(prev => ({
        ...prev,
        incomingUsers: prev.incomingUsers + 1,
        dailyVisits: prev.dailyVisits + 1,
        totalVisits: prev.totalVisits + 1,
      }));
      setShowIncomingAnimation(false);
    }, 2000);
  };

  // Initialize socket connection and join garage room
  useEffect(() => {
    try {
      const newSocket = io("http://localhost:3000", {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected");
        // Get garage key - same format as sent from GarageFinder
        // Format: "garage:owner_name:garage_name:phone_number"
        // This must match the garageId sent from GarageFinder to the /notify endpoint
        const garageKey = garageData?.key || 
                         garageData?.garage?.key ||
                         (garageData?.garage?.owner_name && garageData?.garage?.garage_name && garageData?.garage?.phone_number
                           ? `garage:${garageData.garage.owner_name}:${garageData.garage.garage_name}:${garageData.garage.phone_number}`
                           : null);
        
        if (!garageKey) {
          console.error("Cannot join Socket.IO room: garage key is missing. garageData:", garageData);
          return;
        }
        
        console.log("Joining Socket.IO room with key:", garageKey);
        newSocket.emit("joinGarageRoom", garageKey);
      });

      // Listen for incoming user count updates
      newSocket.on("incomingUserCountUpdated", (count: number) => {
        console.log("Received incoming user count update:", count);
        
        // Use functional update to get the current state and compare
        setRegisteredData(prev => {
          const previousCount = previousCountRef.current;
          const isNewUser = count > previousCount;
          
          // Show animation when count increases
          if (isNewUser) {
            setShowIncomingAnimation(true);
            setTimeout(() => {
              setShowIncomingAnimation(false);
            }, 2000);
          }
          
          // Update the ref for next comparison
          previousCountRef.current = count;
          
          return {
            ...prev,
            incomingUsers: count,
            dailyVisits: prev.dailyVisits + (isNewUser ? 1 : 0),
            totalVisits: prev.totalVisits + (isNewUser ? 1 : 0),
          };
        });
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      return () => {
        newSocket.off("connect");
        newSocket.off("incomingUserCountUpdated");
        newSocket.off("connect_error");
        newSocket.disconnect();
      };
    } catch (error) {
      console.error("Failed to initialize socket:", error);
    }
  }, [garageData?.id]);


  return (
    <div className="min-h-screen bg-black p-4 relative overflow-hidden">
      {/* Incoming User Animation */}
      {showIncomingAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-ping absolute w-32 h-32 rounded-full bg-red-600 opacity-75"></div>
          <div className="relative bg-gradient-to-br from-red-600 to-red-900 border-4 border-red-400 p-8 animate-bounce shadow-[0_0_60px_rgba(239,68,68,0.9)]">
            <p className="text-white font-black text-4xl uppercase tracking-widest"
               style={{
                 textShadow: '0 0 30px rgba(255,255,255,0.8)',
                 fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
               }}>
              NEW USER!
            </p>
            <div className="flex justify-center mt-4">
              <div className="w-3 h-3 bg-white rounded-full mx-1 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-white rounded-full mx-1 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-white rounded-full mx-1 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => window.location.reload()}
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

        {/* Test Button - Remove in production */}
        <div className="mb-6 text-center">
          <button
            onClick={simulateIncomingUser}
            disabled={showIncomingAnimation}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 disabled:from-gray-700 disabled:to-gray-800 text-black font-black text-lg px-8 py-3 tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:shadow-[0_0_30px_rgba(234,179,8,0.8)] border-2 border-yellow-500 disabled:border-gray-600"
            style={{ fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif' }}
          >
            🧪 TEST INCOMING USER
          </button>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-wide">
            (Testing only - Remove in production)
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

        <div className="mt-8 bg-gradient-to-r from-transparent via-red-950 to-transparent p-6 border-t-2 border-b-2 border-red-600/50 mb-6">
          <div className="text-center">
            <p className="text-gray-400 uppercase tracking-wider font-bold mb-2">Garage Details</p>
            <h3 className="text-3xl font-black text-white mb-2 tracking-wider"
                style={{
                  textShadow: '0 0 15px rgba(239,68,68,0.5)',
                  fontFamily: 'Impact, Haettenschweiler, Arial Black, sans-serif'
                }}>
              {garageInfo.garageName}
            </h3>
            <p className="text-red-500 font-bold text-lg">{garageInfo.ownerName}</p>
            <p className="text-gray-400 text-sm mt-2">{garageInfo.phoneNumber}</p>
            <p className="text-gray-500 text-sm mt-1">{garageInfo.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}