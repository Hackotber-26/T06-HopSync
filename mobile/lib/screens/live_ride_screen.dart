import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../theme.dart';
import '../widgets/app_header.dart';
import '../data/mock_data.dart';

const _center = LatLng(12.9767, 77.6038); // MG Road, Bengaluru

/// Same screen serves both sides of a ride: a rider booked from Available
/// Rides sees the driver's card; a driver who started a trip from Ride
/// Detail sees their accepted passenger's card instead. Uses real
/// OpenStreetMap tiles (no API key needed).
class LiveRideScreen extends StatelessWidget {
  final void Function(String screen, {String? role}) navigate;
  final String role;
  const LiveRideScreen({super.key, required this.navigate, this.role = 'rider'});

  @override
  Widget build(BuildContext context) {
    final isDriver = role == 'driver';
    final counterpart = isDriver ? rideRequests.first.name : LiveRideInfo.driver;
    final status = isDriver ? 'Heading to pickup' : LiveRideInfo.status;

    return Scaffold(
      backgroundColor: RColors.paper,
      appBar: NavHeader(title: 'Live Ride Map', onBack: () => navigate('activity')),
      body: Column(
        children: [
          Expanded(
            child: Stack(
              children: [
                FlutterMap(
                  options: const MapOptions(initialCenter: _center, initialZoom: 15),
                  children: [
                    TileLayer(urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', userAgentPackageName: 'com.ridify.mobile'),
                    MarkerLayer(
                      markers: [
                        Marker(
                          point: _center,
                          width: 160,
                          height: 60,
                          child: Column(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8), boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 4)]),
                                child: Text('$counterpart ${isDriver ? "(Passenger)" : "(Driver)"}', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
                              ),
                              const Icon(Icons.location_on, color: RColors.green, size: 30),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                Positioned(
                  top: 12,
                  right: 12,
                  child: Column(
                    children: [
                      _mapButton(Icons.my_location),
                      const SizedBox(height: 8),
                      _mapButton(Icons.explore_outlined),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
            decoration: const BoxDecoration(color: RColors.paperRaised, borderRadius: BorderRadius.vertical(top: Radius.circular(28)), boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 24, offset: Offset(0, -4))]),
            child: SafeArea(
              top: false,
              child: Column(
                children: [
                  Container(width: 36, height: 4, decoration: BoxDecoration(color: RColors.rule, borderRadius: BorderRadius.circular(4))),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      CircleAvatar(radius: 24, backgroundColor: RColors.ink, child: Text(counterpart[0], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700))),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(children: [Text(counterpart, style: const TextStyle(fontWeight: FontWeight.w700)), const SizedBox(width: 4), const Icon(Icons.verified, size: 14, color: RColors.green)]),
                            Container(
                              margin: const EdgeInsets.only(top: 4),
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                              decoration: BoxDecoration(color: RColors.greenSoft, borderRadius: BorderRadius.circular(20)),
                              child: Row(mainAxisSize: MainAxisSize.min, children: [const Icon(Icons.circle, size: 6, color: RColors.green), const SizedBox(width: 6), Text(status, style: const TextStyle(color: RColors.green, fontSize: 12, fontWeight: FontWeight.w600))]),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                        decoration: BoxDecoration(color: Colors.black.withValues(alpha: 0.05), borderRadius: BorderRadius.circular(24)),
                        child: const Text('Board', style: TextStyle(color: RColors.inkSoft, fontWeight: FontWeight.w700)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => navigate('chat'),
                          icon: const Icon(Icons.chat_bubble_outline, size: 18),
                          label: const Text('Chat'),
                          style: OutlinedButton.styleFrom(foregroundColor: RColors.ink, side: const BorderSide(color: RColors.ink), padding: const EdgeInsets.symmetric(vertical: 14), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24))),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: FilledButton(
                          onPressed: () => navigate(isDriver ? 'driverCompletion' : 'riderCompletion'),
                          style: FilledButton.styleFrom(backgroundColor: RColors.ink, padding: const EdgeInsets.symmetric(vertical: 14), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24))),
                          child: const Text('End Ride'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _mapButton(IconData icon) => Container(
        width: 38,
        height: 38,
        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 4)]),
        child: Icon(icon, size: 18, color: RColors.ink),
      );
}
