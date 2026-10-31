import 'package:flutter/material.dart';
import '../theme.dart';
import '../widgets/app_header.dart';
import '../data/mock_data.dart';

class AvailableRidesScreen extends StatefulWidget {
  final void Function(String screen, {String? role}) navigate;
  const AvailableRidesScreen({super.key, required this.navigate});
  @override
  State<AvailableRidesScreen> createState() => _AvailableRidesScreenState();
}

class _AvailableRidesScreenState extends State<AvailableRidesScreen> {
  String filter = 'Any';

  @override
  Widget build(BuildContext context) {
    final rides = availableRides.where((r) => filter == 'Any' || r.vehicle == filter).toList();
    return Scaffold(
      backgroundColor: RColors.paper,
      appBar: NavHeader(title: 'Find a Ride', onBack: () => widget.navigate('findRide')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Available Rides', style: RText.display(size: 22, weight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text('Choose a ride that fits your journey', style: RText.sans(color: RColors.inkSoft)),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(color: RColors.paperRaised, borderRadius: BorderRadius.circular(16), border: Border.all(color: RColors.rule)),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [Icon(Icons.location_on, color: RColors.green, size: 16), SizedBox(width: 10), Text('Baiyappanahalli Metro')]),
                SizedBox(height: 8),
                Row(children: [Icon(Icons.flag, color: RColors.coral, size: 16), SizedBox(width: 10), Text('Nearby tech parks')]),
              ],
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 44,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _filterChip('Any', Icons.grid_view_rounded),
                const SizedBox(width: 8),
                _filterChip('Sedan', Icons.directions_car),
                const SizedBox(width: 8),
                _filterChip('Bike', Icons.two_wheeler),
              ],
            ),
          ),
          const SizedBox(height: 16),
          if (rides.isEmpty) Padding(padding: const EdgeInsets.all(24), child: Center(child: Text('No $filter rides nearby right now.', style: RText.sans(color: RColors.inkSoft)))),
          ...rides.map(
            (r) => Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: RColors.paperRaised, borderRadius: BorderRadius.circular(18), border: Border.all(color: RColors.rule)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CircleAvatar(radius: 22, backgroundColor: RColors.ink, child: Text(r.driver[0], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700))),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(children: [Text(r.driver, style: const TextStyle(fontWeight: FontWeight.w700)), const SizedBox(width: 4), const Icon(Icons.verified, size: 14, color: RColors.green)]),
                              Text('${r.vehicle} · ${r.mode}', style: RText.sans(size: 13, color: RColors.inkSoft)),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text('₹${r.price}', style: RText.display(size: 20, weight: FontWeight.w700)),
                            const Text('Per Seat', style: TextStyle(color: RColors.inkSoft, fontSize: 12)),
                          ],
                        ),
                      ],
                    ),
                    const Divider(height: 24, color: RColors.rule),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Departs at ${r.departs}', style: RText.sans(size: 13, color: RColors.inkSoft)),
                              const SizedBox(height: 4),
                              Row(children: [const Icon(Icons.circle, size: 8, color: RColors.green), const SizedBox(width: 8), Text(r.from, style: RText.sans(size: 14))]),
                              const SizedBox(height: 2),
                              Row(children: [const Icon(Icons.circle, size: 8, color: RColors.coral), const SizedBox(width: 8), Text(r.to, style: RText.sans(size: 14))]),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text('${r.seatsLeft} seats left', style: RText.sans(size: 13, color: RColors.inkSoft)),
                            Text('${r.distanceKm} km', style: RText.sans(size: 13, color: RColors.inkSoft)),
                            const SizedBox(height: 8),
                            FilledButton(
                              onPressed: () => widget.navigate('live', role: 'rider'),
                              style: FilledButton.styleFrom(backgroundColor: RColors.ink, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24))),
                              child: const Text('Book'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _filterChip(String id, IconData icon) {
    final active = filter == id;
    return GestureDetector(
      onTap: () => setState(() => filter = id),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(color: active ? RColors.ink : RColors.paperRaised, borderRadius: BorderRadius.circular(24), border: active ? null : Border.all(color: RColors.rule)),
        alignment: Alignment.center,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [Icon(icon, size: 16, color: active ? Colors.white : RColors.ink), const SizedBox(width: 6), Text(id, style: TextStyle(color: active ? Colors.white : RColors.ink, fontWeight: FontWeight.w600))],
        ),
      ),
    );
  }
}
