import 'package:flutter/material.dart';
import '../theme.dart';

class RBottomNav extends StatelessWidget {
  final String active;
  final void Function(String) onChange;
  final int ridesBadge;
  const RBottomNav({super.key, required this.active, required this.onChange, this.ridesBadge = 0});

  static const _tabs = [
    ('home', 'Home', Icons.home_outlined, Icons.home),
    ('activity', 'Rides', Icons.directions_car_outlined, Icons.directions_car),
    ('history', 'History', Icons.receipt_long_outlined, Icons.receipt_long),
    ('profile', 'Account', Icons.person_outline, Icons.person),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(color: RColors.ink, border: Border(top: BorderSide(color: Colors.white12))),
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).padding.bottom, top: 8),
      child: Row(
        children: _tabs.map((t) {
          final (id, label, outline, filled) = t;
          final isActive = active == id;
          final color = isActive ? Colors.white : Colors.white54;
          return Expanded(
            child: InkWell(
              onTap: () => onChange(id),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Stack(
                  alignment: Alignment.topCenter,
                  children: [
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(isActive ? filled : outline, color: color, size: 22),
                        const SizedBox(height: 2),
                        Text(label, style: TextStyle(color: color, fontSize: 12, fontWeight: isActive ? FontWeight.w600 : FontWeight.w400)),
                      ],
                    ),
                    if (id == 'activity' && ridesBadge > 0)
                      Positioned(
                        right: 28,
                        top: -2,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                          decoration: BoxDecoration(color: RColors.coral, borderRadius: BorderRadius.circular(8)),
                          child: Text('$ridesBadge', style: const TextStyle(color: Colors.white, fontSize: 10)),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
