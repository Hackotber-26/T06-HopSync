import 'package:flutter/material.dart';
import '../theme.dart';

/// Shared pickup/destination block for Find a Ride and Offer a Ride.
/// Tapping a row opens the map picker for that field.
class LocationFields extends StatelessWidget {
  final String pickup, destination;
  final void Function(String field) onPick;
  final VoidCallback onSwap;
  const LocationFields({super.key, required this.pickup, required this.destination, required this.onPick, required this.onSwap});

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        Container(
          decoration: BoxDecoration(
            color: RColors.paperRaised,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: RColors.rule),
          ),
          child: Column(
            children: [
              _row(Icons.location_on, RColors.green, pickup, 'Your Pickup Location', () => onPick('pickup')),
              const Divider(height: 1, color: RColors.rule),
              _row(Icons.flag, RColors.coral, destination, 'Your Destination', () => onPick('destination')),
            ],
          ),
        ),
        GestureDetector(
          onTap: onSwap,
          child: Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: RColors.paperRaised,
              shape: BoxShape.circle,
              border: Border.all(color: RColors.rule),
            ),
            child: const Icon(Icons.swap_vert, size: 18),
          ),
        ),
      ],
    );
  }

  Widget _row(IconData icon, Color color, String value, String placeholder, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Icon(icon, color: color, size: 18),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                value.isEmpty ? placeholder : value,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(fontSize: 15, color: value.isEmpty ? RColors.inkSoft : RColors.ink),
              ),
            ),
            const Icon(Icons.map_outlined, size: 18, color: RColors.inkSoft),
          ],
        ),
      ),
    );
  }
}
