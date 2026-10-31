// Hardcoded demo data — every screen reads from here so the UI is fully
// clickable for a walkthrough without a backend wired up yet.

export const me = {
  name: 'Priyanshu',
  initial: 'P',
  age: 18,
  email: 'priyanshu@gmail.com',
  verified: true,
};

export const homeStats = {
  totalEarnings: 1000,
  totalSpending: 100,
};

export const availableRides = [
  {
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
  },
  {
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
  },
];

export const postedRide = {
  id: 'p1',
  seatsTotal: 3,
  date: '31/10/2026',
  time: '6:45 PM',
  mode: 'Nonstop',
  from: 'Whitefield Metro',
  to: 'ITPL',
  requestCount: 2,
};

export const ongoingRide = {
  id: 'o1',
  seatsTotal: 1,
  date: '31/10/2026',
  time: '7:10 PM',
  mode: 'Flexible Route',
  from: 'Silk Board Metro',
  to: 'HSR Layout Sector 1',
};

export const rideRequests = [
  {
    id: 'req1',
    name: 'Prerit',
    email: 'prerit@gmail.com',
    verified: true,
    fare: 35,
    seats: 1,
    distanceKm: 3.2,
    from: 'Whitefield Metro',
    to: 'ITPL Main Gate',
  },
  {
    id: 'req2',
    name: 'Saket Sharan',
    email: 'saket@gmail.com',
    verified: true,
    fare: 35,
    seats: 1,
    distanceKm: 2.8,
    from: 'Whitefield Metro',
    to: 'Hope Farm Junction',
  },
];

export const historyRides = [
  {
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
    passengersList: [
      {
        id: 'p1',
        name: 'Prerit Gupta',
        email: 'prerit@gmail.com',
        seats: 1,
        fare: 100,
        pickup: 'MG Road Metro',
        drop: 'Sony World Junction',
        verified: true,
      },
      {
        id: 'p2',
        name: 'Saket Sharan',
        email: 'saket@gmail.com',
        seats: 1,
        fare: 100,
        pickup: 'Trinity Circle',
        drop: 'Koramangala 5th Block',
        verified: true,
      },
    ],
  },
  {
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
    passengersList: [
      {
        id: 'p3',
        name: 'Rohit Verma',
        email: 'rohit.v@gmail.com',
        seats: 1,
        fare: 45,
        pickup: 'Nagasandra Metro Gate 2',
        drop: 'Peenya 1st Stage',
        verified: true,
      },
      {
        id: 'p4',
        name: 'Sneha Patel',
        email: 'sneha.p@outlook.com',
        seats: 1,
        fare: 45,
        pickup: 'Nagasandra Metro Gate 1',
        drop: 'Peenya Industrial Area',
        verified: true,
      },
    ],
  },
];

export const liveRide = {
  driver: 'Priyanshu',
  status: 'Waiting for driver',
  mapCenter: { lat: 12.9767, lng: 77.6038 }, // MG Road, Bengaluru
};
