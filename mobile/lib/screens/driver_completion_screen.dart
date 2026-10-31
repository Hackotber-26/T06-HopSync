import 'package:flutter/material.dart';
import '../theme.dart';
import '../data/mock_data.dart';

class DriverCompletionScreen extends StatefulWidget {
  final void Function(String screen) navigate;
  const DriverCompletionScreen({super.key, required this.navigate});
  @override
  State<DriverCompletionScreen> createState() => _DriverCompletionScreenState();
}

class _DriverCompletionScreenState extends State<DriverCompletionScreen> {
  final Map<String, int> ratings = {};

  @override
  Widget build(BuildContext context) {
    final total = rideRequests.fold<int>(0, (s, r) => s + r.fare);
    return Scaffold(
      backgroundColor: RColors.paper,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 32, 20, 20),
          children: [
            Center(child: CircleAvatar(radius: 32, backgroundColor: RColors.greenSoft, child: const Icon(Icons.check, color: RColors.green, size: 30))),
            const SizedBox(height: 16),
            Center(child: Text('Ride completed', style: RText.display(size: 24, weight: FontWeight.w700))),
            Center(child: Text('${PostedRide.from} → ${PostedRide.to}', style: RText.sans(color: RColors.inkSoft))),
            const SizedBox(height: 20),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: RColors.greenSoft, borderRadius: BorderRadius.circular(18)),
              child: Column(
                children: [
                  const Text('You earned', style: TextStyle(color: RColors.inkSoft)),
                  Text('₹$total', style: RText.display(size: 30, weight: FontWeight.w800, color: RColors.green)),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(color: RColors.paperRaised, borderRadius: BorderRadius.circular(18), border: Border.all(color: RColors.rule)),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Column(children: [Text('Duration', style: TextStyle(color: RColors.inkSoft, fontSize: 12)), SizedBox(height: 4), Text('12 mins', style: TextStyle(fontWeight: FontWeight.w700))]),
                  Column(children: [Text('Distance', style: TextStyle(color: RColors.inkSoft, fontSize: 12)), SizedBox(height: 4), Text('3.2 km', style: TextStyle(fontWeight: FontWeight.w700))]),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Text('Rate your passengers', style: RText.sans(weight: FontWeight.w600)),
            const SizedBox(height: 10),
            ...rideRequests.map(
              (p) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(color: RColors.paperRaised, borderRadius: BorderRadius.circular(16), border: Border.all(color: RColors.rule)),
                  child: Row(
                    children: [
                      CircleAvatar(radius: 18, backgroundColor: RColors.ink, child: Text(p.name[0], style: const TextStyle(color: Colors.white))),
                      const SizedBox(width: 12),
                      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(p.name, style: const TextStyle(fontWeight: FontWeight.w700)), Text('₹${p.fare} paid', style: RText.sans(size: 12, color: RColors.inkSoft))])),
                      Row(
                        children: List.generate(5, (i) {
                          final n = i + 1;
                          final filled = (ratings[p.id] ?? 0) >= n;
                          return IconButton(
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                            icon: Icon(filled ? Icons.star : Icons.star_border, size: 20, color: filled ? RColors.signal : RColors.rule),
                            onPressed: () => setState(() => ratings[p.id] = n),
                          );
                        }),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () => widget.navigate('activity'),
                style: FilledButton.styleFrom(backgroundColor: RColors.ink, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32))),
                child: const Text('Done', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
