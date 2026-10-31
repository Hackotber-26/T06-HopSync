import 'package:flutter/material.dart';
import '../theme.dart';
import '../data/mock_data.dart';

class RiderCompletionScreen extends StatefulWidget {
  final void Function(String screen) navigate;
  const RiderCompletionScreen({super.key, required this.navigate});
  @override
  State<RiderCompletionScreen> createState() => _RiderCompletionScreenState();
}

class _RiderCompletionScreenState extends State<RiderCompletionScreen> {
  int rating = 0;

  @override
  Widget build(BuildContext context) {
    final ride = availableRides.first;
    return Scaffold(
      backgroundColor: RColors.paper,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 32, 20, 20),
          children: [
            Center(child: CircleAvatar(radius: 32, backgroundColor: RColors.greenSoft, child: const Icon(Icons.check, color: RColors.green, size: 30))),
            const SizedBox(height: 16),
            Center(child: Text("You've arrived", style: RText.display(size: 24, weight: FontWeight.w700))),
            Center(child: Text('${ride.from} → ${ride.to}', style: RText.sans(color: RColors.inkSoft))),
            const SizedBox(height: 20),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(color: RColors.coralSoft, borderRadius: BorderRadius.circular(18)),
              child: Column(
                children: [
                  const Text('Your share', style: TextStyle(color: RColors.inkSoft)),
                  Text('₹${ride.price}', style: RText.display(size: 30, weight: FontWeight.w800, color: RColors.coral)),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(color: RColors.paperRaised, borderRadius: BorderRadius.circular(18), border: Border.all(color: RColors.rule)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  const Column(children: [Text('Duration', style: TextStyle(color: RColors.inkSoft, fontSize: 12)), SizedBox(height: 4), Text('12 mins', style: TextStyle(fontWeight: FontWeight.w700))]),
                  Column(children: [const Text('Distance', style: TextStyle(color: RColors.inkSoft, fontSize: 12)), const SizedBox(height: 4), Text('${ride.distanceKm} km', style: const TextStyle(fontWeight: FontWeight.w700))]),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: RColors.paperRaised, borderRadius: BorderRadius.circular(18), border: Border.all(color: RColors.rule)),
              child: Column(
                children: [
                  Align(alignment: Alignment.centerLeft, child: Text('Rate ${LiveRideInfo.driver}', style: RText.sans(weight: FontWeight.w600))),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      CircleAvatar(radius: 20, backgroundColor: RColors.ink, child: Text(LiveRideInfo.driver[0], style: const TextStyle(color: Colors.white))),
                      const SizedBox(width: 10),
                      Row(children: [Text(LiveRideInfo.driver, style: const TextStyle(fontWeight: FontWeight.w700)), const SizedBox(width: 4), const Icon(Icons.verified, size: 14, color: RColors.green)]),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(5, (i) {
                      final n = i + 1;
                      final filled = rating >= n;
                      return IconButton(
                        icon: Icon(filled ? Icons.star : Icons.star_border, size: 30, color: filled ? RColors.signal : RColors.rule),
                        onPressed: () => setState(() => rating = n),
                      );
                    }),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () => widget.navigate('home'),
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
