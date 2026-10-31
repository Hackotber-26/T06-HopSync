import 'package:flutter/material.dart';
import 'theme.dart';
import 'widgets/bottom_nav.dart';
import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/home_screen.dart';
import 'screens/find_ride_screen.dart';
import 'screens/available_rides_screen.dart';
import 'screens/offer_ride_screen.dart';
import 'screens/activity_screen.dart';
import 'screens/ride_detail_screen.dart';
import 'screens/history_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/live_ride_screen.dart';
import 'screens/map_picker_screen.dart';
import 'screens/chat_screen.dart';
import 'screens/driver_completion_screen.dart';
import 'screens/rider_completion_screen.dart';
import 'screens/admin_login_screen.dart';
import 'screens/admin_verify_screen.dart';
import 'data/mock_data.dart';

const _tabs = {'home', 'activity', 'history', 'profile'};

class RidifyApp extends StatelessWidget {
  const RidifyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(title: 'Ridify', debugShowCheckedModeBanner: false, theme: ridifyTheme(), home: const _Root());
  }
}

class _Root extends StatefulWidget {
  const _Root();
  @override
  State<_Root> createState() => _RootState();
}

class _RootState extends State<_Root> {
  String screen = 'login';
  String liveRole = 'rider';
  String pickup = '', destination = '';
  String pickerField = 'pickup', pickerFrom = 'findRide';

  // navigate('live', role: 'driver') also sets who the live screen shows —
  // a rider booking a seat vs. a driver who just started a trip.
  void navigate(String next, {String? role}) {
    setState(() {
      if (role != null) liveRole = role;
      screen = next;
    });
  }

  void openPicker(String field, String from) {
    setState(() {
      pickerField = field;
      pickerFrom = from;
      screen = 'mapPicker';
    });
  }

  void confirmLocation(String label) {
    setState(() {
      if (pickerField == 'pickup') {
        pickup = label;
      } else {
        destination = label;
      }
      screen = pickerFrom;
    });
  }

  void swapLocations() {
    setState(() {
      final t = pickup;
      pickup = destination;
      destination = t;
    });
  }

  Widget _build() {
    switch (screen) {
      case 'login':
        return LoginScreen(navigate: navigate);
      case 'signup':
        return SignupScreen(navigate: navigate);
      case 'home':
        return HomeScreen(navigate: navigate);
      case 'findRide':
        return FindRideScreen(navigate: navigate, pickup: pickup, destination: destination, onPickLocation: (f) => openPicker(f, 'findRide'), onSwap: swapLocations);
      case 'availableRides':
        return AvailableRidesScreen(navigate: navigate);
      case 'offerRide':
        return OfferRideScreen(navigate: navigate, pickup: pickup, destination: destination, onPickLocation: (f) => openPicker(f, 'offerRide'), onSwap: swapLocations);
      case 'activity':
        return ActivityScreen(navigate: navigate);
      case 'rideDetail':
        return RideDetailScreen(navigate: navigate);
      case 'history':
        return const HistoryScreen();
      case 'profile':
        return ProfileScreen(onLogout: () => navigate('login'));
      case 'live':
        return LiveRideScreen(navigate: navigate, role: liveRole);
      case 'mapPicker':
        return MapPickerScreen(field: pickerField, onBack: () => setState(() => screen = pickerFrom), onConfirm: confirmLocation);
      case 'chat':
        return ChatScreen(onBack: () => setState(() => screen = 'live'));
      case 'driverCompletion':
        return DriverCompletionScreen(navigate: navigate);
      case 'riderCompletion':
        return RiderCompletionScreen(navigate: navigate);
      case 'adminLogin':
        return AdminLoginScreen(navigate: navigate);
      case 'adminVerify':
        return AdminVerifyScreen(navigate: navigate);
      default:
        return HomeScreen(navigate: navigate);
    }
  }

  @override
  Widget build(BuildContext context) {
    final showNav = _tabs.contains(screen);
    final ridesBadge = PostedRide.requestCount + 1;
    return Scaffold(
      backgroundColor: RColors.paper,
      body: _build(),
      bottomNavigationBar: showNav ? RBottomNav(active: screen, onChange: navigate, ridesBadge: ridesBadge) : null,
    );
  }
}
