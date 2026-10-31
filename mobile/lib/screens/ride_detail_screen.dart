import 'package:flutter/material.dart';
import '../theme.dart';
import '../data/mock_data.dart';

class RideDetailScreen extends StatefulWidget {
  final void Function(String screen, {String? role}) navigate;
  const RideDetailScreen({super.key, required this.navigate});
  @override
  State<RideDetailScreen> createState() => _RideDetailScreenState();
}

class _RideDetailScreenState extends State<RideDetailScreen> {
  final Map<String, String> decisions = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RColors.paper,
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          SafeArea(
            bottom: false,
            child: Row(
              children: [
                InkWell(
                  onTap: () => widget.navigate('activity'),
                  borderRadius: BorderRadius.circular(20),
                  child: Container(width: 36, height: 36, decoration: BoxDecoration(color: Colors.black.withValues(alpha: 0.05), shape: BoxShape.circle), child: const Icon(Icons.arrow_back, size: 18)),
                ),
                const SizedBox(width: 14),
                Text('Ride Detail', style: RText.display(size: 24, weight: FontWeight.w700)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          InkWell(
            onTap: () => widget.navigate('live', role: 'driver'),
            borderRadius: BorderRadius.circular(18),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: RColors.paperRaised, borderRadius: BorderRadius.circular(18), border: Border.all(color: RColors.rule)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
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
                      InkWell(
                        onTap: () => widget.navigate('activity'),
                        child: const Padding(
                          padding: EdgeInsets.all(4),
                          child: Icon(Icons.close, color: RColors.inkSoft),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Row(children: [const Icon(Icons.circle, size: 10, color: RColors.green), const SizedBox(width: 10), Text(PostedRide.from, style: const TextStyle(fontWeight: FontWeight.w600))]),
                  const SizedBox(height: 4),
                  Row(children: [const Icon(Icons.circle, size: 10, color: RColors.coral), const SizedBox(width: 10), Text(PostedRide.to, style: const TextStyle(fontWeight: FontWeight.w600))]),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text('Requests', style: RText.sans(weight: FontWeight.w600)),
          const SizedBox(height: 12),
          ...rideRequests.map((r) => _requestCard(r)),
        ],
      ),
    );
  }

  Widget _requestCard(RideRequest r) {
    final decision = decisions[r.id];
    return Padding(
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
                CircleAvatar(radius: 22, backgroundColor: RColors.ink, child: Text(r.name[0], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700))),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [Text(r.name, style: const TextStyle(fontWeight: FontWeight.w700)), const SizedBox(width: 4), const Icon(Icons.verified, size: 14, color: RColors.green)]),
                      Text(r.email, style: RText.sans(size: 13, color: RColors.inkSoft)),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.event_seat, size: 14, color: RColors.inkSoft),
                          Text(' ${r.seats}  ', style: RText.sans(size: 13, color: RColors.inkSoft)),
                          const Icon(Icons.swap_vert, size: 14, color: RColors.inkSoft),
                          Text(' ${r.distanceKm} km', style: RText.sans(size: 13, color: RColors.inkSoft)),
                        ],
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(color: RColors.greenSoft, borderRadius: BorderRadius.circular(20)),
                  child: Text('₹${r.fare}', style: const TextStyle(color: RColors.green, fontWeight: FontWeight.w700)),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: RColors.paper, borderRadius: BorderRadius.circular(12), border: Border.all(color: RColors.rule)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.circle, size: 8, color: RColors.green), const SizedBox(width: 8), Text(r.from, style: RText.sans(size: 13))]),
                  const SizedBox(height: 4),
                  Row(children: [const Icon(Icons.circle, size: 8, color: RColors.coral), const SizedBox(width: 8), Text(r.to, style: RText.sans(size: 13))]),
                ],
              ),
            ),
            const SizedBox(height: 12),
            if (decision == 'accepted')
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(color: RColors.greenSoft, borderRadius: BorderRadius.circular(24)),
                alignment: Alignment.center,
                child: const Text('Accepted', style: TextStyle(color: RColors.green, fontWeight: FontWeight.w700)),
              ) else if (decision == 'declined')
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(color: RColors.coralSoft, borderRadius: BorderRadius.circular(24)),
                alignment: Alignment.center,
                child: const Text('Declined', style: TextStyle(color: RColors.coral, fontWeight: FontWeight.w700)),
              )
            else
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => setState(() => decisions[r.id] = 'declined'),
                      style: OutlinedButton.styleFrom(foregroundColor: RColors.coral, side: const BorderSide(color: RColors.coral), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24))),
                      child: const Text('Decline'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: FilledButton(
                      onPressed: () => setState(() => decisions[r.id] = 'accepted'),
                      style: FilledButton.styleFrom(backgroundColor: RColors.ink, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24))),
                      child: const Text('Accept'),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
