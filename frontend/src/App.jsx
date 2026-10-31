import { useEffect, useRef, useState } from 'react';
import BottomNav from './components/BottomNav';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Home from './screens/Home';
import FindRide from './screens/FindRide';
import AvailableRides from './screens/AvailableRides';
import OfferRide from './screens/OfferRide';
import Activity from './screens/Activity';
import RideDetail from './screens/RideDetail';
import History from './screens/History';
import Profile from './screens/Profile';
import LiveRide from './screens/LiveRide';
import MapPicker from './screens/MapPicker';
import Chat from './screens/Chat';
import DriverCompletion from './screens/DriverCompletion';
import RiderCompletion from './screens/RiderCompletion';
import { postedRide, ongoingRide } from './mock/data';

const TABS = new Set(['home', 'activity', 'history', 'profile']);

export default function App() {
  const [screen, setScreen] = useState('login');
  const [liveRole, setLiveRole] = useState('rider');
  const [locations, setLocations] = useState({ pickup: '', destination: '' });
  const [picker, setPicker] = useState({ field: 'pickup', from: 'findRide' });
  const scrollRef = useRef(null);

  // Each screen is a fresh "page" — don't carry over the last screen's
  // scroll offset when navigating.
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [screen]);

  // navigate('live', { role: 'driver' }) also sets who the live screen is
  // showing — a rider booking a seat vs. a driver who just started a trip.
  function navigate(next, opts) {
    if (opts?.role) setLiveRole(opts.role);
    setScreen(next);
  }

  function openPicker(field, from) {
    setPicker({ field, from });
    setScreen('mapPicker');
  }

  function confirmLocation(label) {
    setLocations((l) => ({ ...l, [picker.field]: label }));
    setScreen(picker.from);
  }

  function swapLocations() {
    setLocations((l) => ({ pickup: l.destination, destination: l.pickup }));
  }

  const screens = {
    login: <Login navigate={navigate} />,
    signup: <Signup navigate={navigate} />,
    home: <Home navigate={navigate} />,
    findRide: (
      <FindRide navigate={navigate} locations={locations} onPickLocation={openPicker} onSwapLocations={swapLocations} />
    ),
    availableRides: <AvailableRides navigate={navigate} />,
    offerRide: (
      <OfferRide navigate={navigate} locations={locations} onPickLocation={openPicker} onSwapLocations={swapLocations} />
    ),
    activity: <Activity navigate={navigate} />,
    rideDetail: <RideDetail navigate={navigate} />,
    history: <History navigate={navigate} />,
    profile: <Profile onLogout={() => navigate('login')} />,
    live: <LiveRide navigate={navigate} role={liveRole} />,
    mapPicker: <MapPicker field={picker.field} onBack={() => setScreen(picker.from)} onConfirm={confirmLocation} />,
    chat: <Chat onBack={() => setScreen('live')} />,
    driverCompletion: <DriverCompletion navigate={navigate} />,
    riderCompletion: <RiderCompletion navigate={navigate} />,
  };

  const showNav = TABS.has(screen);
  const ridesBadge = postedRide.requestCount + (ongoingRide ? 1 : 0);

  return (
    <div className="min-h-dvh bg-paper flex flex-col sm:max-w-[430px] sm:mx-auto sm:shadow-xl sm:min-h-0 sm:my-4 sm:rounded-3xl sm:overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {screens[screen]}
      </div>
      {showNav && <BottomNav active={screen} onChange={navigate} ridesBadge={ridesBadge} />}
    </div>
  );
}
