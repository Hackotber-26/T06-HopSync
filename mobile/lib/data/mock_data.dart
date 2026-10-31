// Hardcoded demo data — mirrors frontend/src/mock/data.js so both builds
// show the same scenario during a walkthrough.

class Me {
  static const name = 'Priyanshu';
  static const initial = 'P';
  static const age = 18;
  static const email = 'priyanshu@gmail.com';
  static const verified = true;
}

class HomeStats {
  static const totalEarnings = 1000;
  static const totalSpending = 100;
}

class RideOption {
  final String id, driver, vehicle, mode, departs, from, to;
  final bool verified;
  final int price, seatsLeft;
  final double distanceKm;
  const RideOption({
    required this.id,
    required this.driver,
    required this.verified,
    required this.vehicle,
    required this.mode,
    required this.price,
    required this.departs,
    required this.seatsLeft,
    required this.distanceKm,
    required this.from,
    required this.to,
  });
}

const availableRides = [
  RideOption(
    id: 'r1',
    driver: 'Ananya Rao',
    verified: true,
    vehicle: 'Sedan',
    mode: 'Flexible Route',
    price: 45,
    departs: '6:52 PM',
    seatsLeft: 2,
    distanceKm: 4.2,
    from: 'Baiyappanahalli Metro',
    to: 'Bagmane Tech Park',
  ),
  RideOption(
    id: 'r2',
    driver: 'Rahul Nair',
    verified: true,
    vehicle: 'SUV',
    mode: 'Shared Start',
    price: 60,
    departs: '6:55 PM',
    seatsLeft: 3,
    distanceKm: 6.1,
    from: 'Baiyappanahalli Metro',
    to: 'Indiranagar 100 Ft Rd',
  ),
];

class PostedRide {
  static const seatsTotal = 3;
  static const date = '31/10/2026';
  static const time = '6:45 PM';
  static const mode = 'Nonstop';
  static const from = 'Whitefield Metro';
  static const to = 'ITPL';
  static const requestCount = 2;
}

class OngoingRide {
  static const seatsTotal = 1;
  static const date = '31/10/2026';
  static const time = '7:10 PM';
  static const mode = 'Flexible Route';
  static const from = 'Silk Board Metro';
  static const to = 'HSR Layout Sector 1';
}

class RideRequest {
  final String id, name, email, from, to;
  final bool verified;
  final int fare, seats;
  final double distanceKm;
  const RideRequest({
    required this.id,
    required this.name,
    required this.email,
    required this.verified,
    required this.fare,
    required this.seats,
    required this.distanceKm,
    required this.from,
    required this.to,
  });
}

const rideRequests = [
  RideRequest(
    id: 'req1',
    name: 'Prerit',
    email: 'prerit@gmail.com',
    verified: true,
    fare: 35,
    seats: 1,
    distanceKm: 3.2,
    from: 'Whitefield Metro',
    to: 'ITPL Main Gate',
  ),
  RideRequest(
    id: 'req2',
    name: 'Saket Sharan',
    email: 'saket@gmail.com',
    verified: true,
    fare: 35,
    seats: 1,
    distanceKm: 2.8,
    from: 'Whitefield Metro',
    to: 'Hope Farm Junction',
  ),
];

class HistoryRide {
  final String id, role, from, to, date, time, duration;
  final int amount, passengers;
  final double distanceKm;
  const HistoryRide({
    required this.id,
    required this.role,
    required this.amount,
    required this.from,
    required this.to,
    required this.date,
    required this.time,
    required this.duration,
    required this.distanceKm,
    required this.passengers,
  });
}

const historyRides = [
  HistoryRide(
    id: 'h1',
    role: 'Offered (Driver)',
    amount: 200,
    from: 'MG Road Metro',
    to: 'Koramangala 5th Block',
    date: '30/10/2026',
    time: '8:12 PM',
    duration: '14 mins',
    distanceKm: 5.5,
    passengers: 2,
  ),
  HistoryRide(
    id: 'h2',
    role: 'Offered (Driver)',
    amount: 90,
    from: 'Nagasandra Metro',
    to: 'Peenya Industrial Area',
    date: '29/10/2026',
    time: '9:40 AM',
    duration: '9 mins',
    distanceKm: 3.5,
    passengers: 2,
  ),
];

class LiveRideInfo {
  static const driver = 'Priyanshu';
  static const status = 'Waiting for driver';
}
