import 'package:flutter/material.dart';
import '../theme.dart';
import '../widgets/app_header.dart';
import '../data/mock_data.dart';

class ActivityScreen extends StatelessWidget {
  final void Function(String screen, {String? role}) navigate;
  const ActivityScreen({super.key, required this.navigate});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const BrandHeader(),
      backgroundColor: RColors.paper,
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back),
                color: RColors.ink,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                onPressed: () => navigate('home'),
              ),
              const SizedBox(width: 12),
              Text('Activity', style: RText.display(size: 24, weight: FontWeight.w700)),
            ],
          ),
          const SizedBox(height: 20),
          Text('Your Posted Rides', style: RText.sans(weight: FontWeight.w600)),
          const SizedBox(height: 10),
          InkWell(
            onTap: () => navigate('rideDetail'),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: RColors.paperRaised, borderRadius: BorderRadius.circular(18), border: Border.all(color: RColors.rule)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.airport_shuttle),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('${PostedRide.seatsTotal} Seats', style: const TextStyle(fontWeight: FontWeight.w700)),
                            Text('${PostedRide.date} · ${PostedRide.time}', style: RText.sans(size: 13, color: RColors.inkSoft)),
                            Text(PostedRide.mode, style: RText.sans(size: 13, color: RColors.inkSoft)),
                          ],
                        ),
                      ),
                      CircleAvatar(radius: 14, backgroundColor: RColors.greenSoft, child: Text('${PostedRide.requestCount}', style: const TextStyle(color: RColors.green, fontWeight: FontWeight.w700))),
                      const SizedBox(width: 6),
                      const Icon(Icons.chevron_right, color: RColors.inkSoft),
                    ],
                  ),
                  const SizedBox(height: 14),
                  _route(PostedRide.from, PostedRide.to),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text('Ongoing Rides', style: RText.sans(weight: FontWeight.w600)),
          const SizedBox(height: 10),
          InkWell(
            onTap: () => navigate('live', role: 'rider'),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: RColors.paperRaised, borderRadius: BorderRadius.circular(18), border: Border.all(color: RColors.rule)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.directions_car),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('${OngoingRide.seatsTotal} Seat', style: const TextStyle(fontWeight: FontWeight.w700)),
                            Text('${OngoingRide.date} · ${OngoingRide.time}', style: RText.sans(size: 13, color: RColors.inkSoft)),
                            Text(OngoingRide.mode, style: RText.sans(size: 13, color: RColors.inkSoft)),
                          ],
                        ),
                      ),
                      const Icon(Icons.chevron_right, color: RColors.inkSoft),
                    ],
                  ),
                  const SizedBox(height: 14),
                  _route(OngoingRide.from, OngoingRide.to),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _route(String from, String to) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [const Icon(Icons.circle, size: 10, color: RColors.green), const SizedBox(width: 10), Text(from, style: const TextStyle(fontWeight: FontWeight.w600))]),
          const SizedBox(height: 4),
          Row(children: [const Icon(Icons.circle, size: 10, color: RColors.coral), const SizedBox(width: 10), Text(to, style: const TextStyle(fontWeight: FontWeight.w600))]),
        ],
      );
}
