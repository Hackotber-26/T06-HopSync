import { useEffect, useRef, useState } from 'react';
import BottomNav from './components/BottomNav';
import Home from './screens/Home';
import FindRide from './screens/FindRide';
import AvailableRides from './screens/AvailableRides';
import OfferRide from './screens/OfferRide';
import Activity from './screens/Activity';
import RideDetail from './screens/RideDetail';
import History from './screens/History';
import Profile from './screens/Profile';
import LiveRide from './screens/LiveRide';
import { postedRide, ongoingRide } from './mock/data';

const TABS = new Set(['home', 'activity', 'history', 'profile']);

export default function App() {
  const [screen, setScreen] = useState('home');
  const scrollRef = useRef(null);

  // Each screen is a fresh "page" — don't carry over the last screen's
  // scroll offset when navigating.
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [screen]);

  const screens = {
    home: <Home navigate={setScreen} />,
    findRide: <FindRide navigate={setScreen} />,
    availableRides: <AvailableRides navigate={setScreen} />,
    offerRide: <OfferRide navigate={setScreen} />,
    activity: <Activity navigate={setScreen} />,
    rideDetail: <RideDetail navigate={setScreen} />,
    history: <History navigate={setScreen} />,
    profile: <Profile onLogout={() => setScreen('home')} />,
    live: <LiveRide navigate={setScreen} />,
  };

  const showNav = TABS.has(screen);
  const ridesBadge = postedRide.requestCount + (ongoingRide ? 1 : 0);

  return (
    <div className="min-h-dvh bg-paper flex flex-col sm:max-w-[430px] sm:mx-auto sm:shadow-xl sm:min-h-0 sm:my-4 sm:rounded-3xl sm:overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {screens[screen]}
      </div>
      {showNav && <BottomNav active={screen} onChange={setScreen} ridesBadge={ridesBadge} />}
    </div>
  );
}
