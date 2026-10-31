import 'package:flutter/material.dart';
import '../theme.dart';
import '../widgets/app_header.dart';
import '../data/mock_data.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const BrandHeader(),
      backgroundColor: RColors.paper,
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Ride History', style: RText.display(size: 24, weight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text('Your recent rides and earnings', style: RText.sans(color: RColors.inkSoft)),
          const SizedBox(height: 16),
          ...historyRides.map(
            (h) => Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: RColors.paperRaised, borderRadius: BorderRadius.circular(18), border: Border.all(color: RColors.rule)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(color: const Color(0xFFE7F1FC), borderRadius: BorderRadius.circular(20)),
                          child: Text(h.role, style: const TextStyle(color: Color(0xFF2F7DD9), fontWeight: FontWeight.w700, fontSize: 13)),
                        ),
                        Text('₹${h.amount}', style: RText.display(size: 20, weight: FontWeight.w700, color: RColors.green)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(children: [const Icon(Icons.circle, size: 10, color: RColors.green), const SizedBox(width: 10), Expanded(child: Text(h.from, style: const TextStyle(fontWeight: FontWeight.w600)))]),
                    const SizedBox(height: 4),
                    Row(children: [const Icon(Icons.circle, size: 10, color: RColors.coral), const SizedBox(width: 10), Expanded(child: Text(h.to, style: const TextStyle(fontWeight: FontWeight.w600)))]),
                    const Divider(height: 24, color: RColors.rule),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _stat(Icons.access_time, 'Duration', h.duration),
                        _stat(Icons.swap_vert, 'Distance', '${h.distanceKm} km'),
                        _stat(Icons.people_outline, 'Passengers', '${h.passengers}'),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(color: Colors.black.withValues(alpha: 0.05), borderRadius: BorderRadius.circular(20)),
                          child: const Row(mainAxisSize: MainAxisSize.min, children: [Icon(Icons.person_outline, size: 15), SizedBox(width: 6), Text('View Passengers', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13))]),
                        ),
                        const Row(children: [Icon(Icons.check_circle, size: 16, color: RColors.green), SizedBox(width: 4), Text('Completed', style: TextStyle(color: RColors.green, fontWeight: FontWeight.w700))]),
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

  Widget _stat(IconData icon, String label, String value) => Column(
        children: [
          Row(mainAxisSize: MainAxisSize.min, children: [Icon(icon, size: 14, color: RColors.inkSoft), const SizedBox(width: 4), Text(label, style: RText.sans(size: 12, color: RColors.inkSoft))]),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w700)),
        ],
      );
}
