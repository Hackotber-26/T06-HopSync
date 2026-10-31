import 'package:flutter/material.dart';
import '../theme.dart';
import '../widgets/app_header.dart';
import '../widgets/location_fields.dart';
import '../widgets/schedule_field.dart';

class OfferRideScreen extends StatefulWidget {
  final void Function(String screen, {String? role}) navigate;
  final String pickup, destination;
  final void Function(String field) onPickLocation;
  final VoidCallback onSwap;
  const OfferRideScreen({super.key, required this.navigate, required this.pickup, required this.destination, required this.onPickLocation, required this.onSwap});
  @override
  State<OfferRideScreen> createState() => _OfferRideScreenState();
}

class _OfferRideScreenState extends State<OfferRideScreen> {
  String flex = 'Nonstop';
  String vehicle = 'Sedan';
  int seats = 1;
  final price = TextEditingController();

  static const flexOptions = [
    ('Nonstop', 'Exact pickup and drop only'),
    ('Shared Start', 'Same pickup, flexible drop'),
    ('Flexible', 'Pickup & drop anywhere'),
  ];
  static const vehicles = [('Bike', Icons.two_wheeler), ('Sedan', Icons.directions_car), ('SUV', Icons.airport_shuttle)];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RColors.paper,
      appBar: NavHeader(title: 'Offer a Ride', onBack: () => widget.navigate('home')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          LocationFields(pickup: widget.pickup, destination: widget.destination, onPick: widget.onPickLocation, onSwap: widget.onSwap),
          const SizedBox(height: 24),
          Text('Route Flexibility', style: RText.sans(weight: FontWeight.w600)),
          Text('Choose how flexible you want your route to be', style: RText.sans(color: RColors.inkSoft, size: 13)),
          const SizedBox(height: 10),
          Row(
            children: flexOptions.map((f) {
              final active = flex == f.$1;
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GestureDetector(
                    onTap: () => setState(() => flex = f.$1),
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(color: active ? RColors.ink : RColors.paperRaised, borderRadius: BorderRadius.circular(14), border: active ? null : Border.all(color: RColors.rule)),
                      child: Column(
                        children: [
                          Text(f.$1, textAlign: TextAlign.center, style: TextStyle(color: active ? Colors.white : RColors.ink, fontWeight: FontWeight.w700, fontSize: 13)),
                          const SizedBox(height: 4),
                          Text(f.$2, textAlign: TextAlign.center, style: TextStyle(color: active ? Colors.white60 : RColors.inkSoft, fontSize: 11)),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          Text('Vehicle Type', style: RText.sans(weight: FontWeight.w600)),
          const SizedBox(height: 10),
          Row(
            children: vehicles.map((v) {
              final active = vehicle == v.$1;
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GestureDetector(
                    onTap: () => setState(() => vehicle = v.$1),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      decoration: BoxDecoration(color: active ? RColors.ink : RColors.paperRaised, borderRadius: BorderRadius.circular(14), border: active ? null : Border.all(color: RColors.rule)),
                      child: Column(
                        children: [
                          Icon(v.$2, color: active ? Colors.white : RColors.ink),
                          const SizedBox(height: 6),
                          Text(v.$1, style: TextStyle(color: active ? Colors.white : RColors.ink, fontWeight: FontWeight.w700)),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          const ScheduleField(),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [Text('Seats Available', style: RText.sans(weight: FontWeight.w600)), const Text('Max: 4', style: TextStyle(color: RColors.inkSoft))],
          ),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 4,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
            childAspectRatio: 1.3,
            children: List.generate(4, (i) {
              final n = i + 1;
              final active = seats == n;
              return GestureDetector(
                onTap: () => setState(() => seats = n),
                child: Container(
                  decoration: BoxDecoration(color: active ? RColors.ink : RColors.paperRaised, borderRadius: BorderRadius.circular(12), border: active ? null : Border.all(color: RColors.rule)),
                  alignment: Alignment.center,
                  child: Text('$n', style: TextStyle(color: active ? Colors.white : RColors.ink, fontSize: 18, fontWeight: FontWeight.w700)),
                ),
              );
            }),
          ),
          const SizedBox(height: 24),
          Text('Price', style: RText.sans(weight: FontWeight.w600)),
          const SizedBox(height: 10),
          TextField(
            controller: price,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              hintText: 'Enter base price',
              filled: true,
              fillColor: RColors.paperRaised,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: RColors.rule)),
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () => widget.navigate('activity'),
              style: FilledButton.styleFrom(backgroundColor: RColors.ink, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32))),
              child: const Text('Offer Ride', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
            ),
          ),
        ],
      ),
    );
  }
}
