// Namma Metro stations and the last-mile destination zones around them.
// distanceKm is the approximate road distance from the station exit;
// bearing (degrees from north) lets us pool riders heading the same way.
export const STATIONS = [
  {
    id: 'baiyappanahalli',
    name: 'Baiyappanahalli',
    line: 'Purple',
    exits: ['Gate A (Old Madras Rd)', 'Gate B (NGEF side)'],
    zones: [
      { id: 'bagmane-tech', name: 'Bagmane Tech Park', distanceKm: 3.2, bearing: 120 },
      { id: 'cv-raman-nagar', name: 'CV Raman Nagar', distanceKm: 2.6, bearing: 110 },
      { id: 'kr-puram', name: 'KR Puram', distanceKm: 4.5, bearing: 80 },
      { id: 'indiranagar-100ft', name: 'Indiranagar 100 Ft Rd', distanceKm: 3.0, bearing: 200 },
    ],
  },
  {
    id: 'mg-road',
    name: 'MG Road',
    line: 'Purple',
    exits: ['Gate 1 (Brigade Rd)', 'Gate 2 (Trinity side)'],
    zones: [
      { id: 'ub-city', name: 'UB City', distanceKm: 2.0, bearing: 250 },
      { id: 'richmond-town', name: 'Richmond Town', distanceKm: 2.4, bearing: 190 },
      { id: 'domlur', name: 'Domlur / EGL', distanceKm: 4.8, bearing: 110 },
      { id: 'koramangala', name: 'Koramangala 5th Block', distanceKm: 5.5, bearing: 170 },
    ],
  },
  {
    id: 'nagasandra',
    name: 'Nagasandra',
    line: 'Green',
    exits: ['Gate A (Tumkur Rd)'],
    zones: [
      { id: 'peenya-ind', name: 'Peenya Industrial Area', distanceKm: 3.5, bearing: 160 },
      { id: 'jalahalli', name: 'Jalahalli Cross', distanceKm: 2.2, bearing: 60 },
      { id: 'brigade-gateway-n', name: 'Bagalagunte', distanceKm: 2.8, bearing: 330 },
    ],
  },
  {
    id: 'whitefield',
    name: 'Whitefield (Kadugodi)',
    line: 'Purple',
    exits: ['Gate A (Kadugodi)', 'Gate B (Channasandra)'],
    zones: [
      { id: 'itpl', name: 'ITPL', distanceKm: 3.0, bearing: 250 },
      { id: 'prestige-shantiniketan', name: 'Prestige Shantiniketan', distanceKm: 3.8, bearing: 240 },
      { id: 'hope-farm', name: 'Hope Farm Junction', distanceKm: 1.8, bearing: 220 },
      { id: 'varthur', name: 'Varthur', distanceKm: 6.5, bearing: 190 },
    ],
  },
  {
    id: 'silk-board',
    name: 'Central Silk Board',
    line: 'Yellow',
    exits: ['Gate 1 (HSR side)', 'Gate 2 (BTM side)'],
    zones: [
      { id: 'hsr-sector-1', name: 'HSR Layout Sector 1', distanceKm: 2.5, bearing: 120 },
      { id: 'agara', name: 'Agara / ORR', distanceKm: 4.2, bearing: 60 },
      { id: 'btm-2nd', name: 'BTM 2nd Stage', distanceKm: 2.3, bearing: 280 },
      { id: 'bellandur', name: 'Bellandur / Ecospace', distanceKm: 7.0, bearing: 80 },
    ],
  },
];

export function findStation(id) {
  return STATIONS.find((s) => s.id === id);
}

export function findZone(station, zoneId) {
  return station?.zones.find((z) => z.id === zoneId);
}
