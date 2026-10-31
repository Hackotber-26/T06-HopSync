import 'package:flutter/material.dart';
import '../theme.dart';
import '../widgets/app_header.dart';
import '../widgets/location_fields.dart';
import '../widgets/schedule_field.dart';

class FindRideScreen extends StatefulWidget {
  final void Function(String screen, {String? role}) navigate;
  final String pickup, destination;
  final void Function(String field) onPickLocation;
  final VoidCallback onSwap;
  const FindRideScreen({super.key, required this.navigate, required this.pickup, required this.destination, required this.onPickLocation, required this.onSwap});
  @override
  State<FindRideScreen> createState() => _FindRideScreenState();
}

class _FindRideScreenState extends State<FindRideScreen> {
  double radius = 1.0;
  int seats = 1;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RColors.paper,
      appBar: NavHeader(title: 'Find a Ride', onBack: () => widget.navigate('home')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          LocationFields(pickup: widget.pickup, destination: widget.destination, onPick: widget.onPickLocation, onSwap: widget.onSwap),
          const SizedBox(height: 24),
          Text('Search Radius', style: RText.sans(weight: FontWeight.w600)),
          Row(
            children: [
              const Text('100m', style: TextStyle(color: RColors.inkSoft, fontSize: 13)),
              Expanded(
                child: Slider(value: radius, min: 0.1, max: 2, activeColor: RColors.ink, onChanged: (v) => setState(() => radius = v)),
              ),
              const Text('2km', style: TextStyle(color: RColors.inkSoft, fontSize: 13)),
            ],
          ),
          Text('Searching within ${radius.toStringAsFixed(1)} km of your radius', style: RText.sans(color: RColors.inkSoft)),
          const SizedBox(height: 24),
          const ScheduleField(),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Seats Needed', style: RText.sans(weight: FontWeight.w600)),
              const Text('Max: 6', style: TextStyle(color: RColors.inkSoft)),
            ],
          ),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 4,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
            childAspectRatio: 1.3,
            children: List.generate(6, (i) {
              final n = i + 1;
              final active = seats == n;
              return GestureDetector(
                onTap: () => setState(() => seats = n),
                child: Container(
                  decoration: BoxDecoration(
                    color: active ? RColors.ink : RColors.paperRaised,
                    borderRadius: BorderRadius.circular(12),
                    border: active ? null : Border.all(color: RColors.rule),
                  ),
                  alignment: Alignment.center,
                  child: Text('$n', style: TextStyle(color: active ? Colors.white : RColors.ink, fontSize: 18, fontWeight: FontWeight.w700)),
                ),
              );
            }),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () => widget.navigate('availableRides'),
              style: FilledButton.styleFrom(backgroundColor: RColors.ink, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32))),
              child: const Text('Search Rides', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
            ),
          ),
        ],
      ),
    );
  }
}
