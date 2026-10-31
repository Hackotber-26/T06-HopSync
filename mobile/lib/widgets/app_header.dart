import 'package:flutter/material.dart';
import '../theme.dart';

/// Root-tab screens (Home, Rides, History, Account) get the brand mark.
class BrandHeader extends StatelessWidget implements PreferredSizeWidget {
  final Widget? trailing;
  const BrandHeader({super.key, this.trailing});
  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: RColors.ink,
      automaticallyImplyLeading: false,
      titleSpacing: 20,
      title: Row(
        children: [
          Text('Ridify', style: RText.display(size: 22, weight: FontWeight.w800, color: Colors.white)),
          const SizedBox(width: 8),
          const Icon(Icons.directions_car_filled, color: Colors.white, size: 26),
        ],
      ),
      actions: trailing != null ? [trailing!] : null,
    );
  }
}

/// Pushed screens (Find a Ride, Offer a Ride, Live Ride Map…) get a back
/// arrow and title instead.
class NavHeader extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final VoidCallback onBack;
  final Widget? trailing;
  const NavHeader({super.key, required this.title, required this.onBack, this.trailing});
  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: RColors.ink,
      leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: onBack),
      title: Text(title, style: RText.display(size: 19, weight: FontWeight.w600, color: Colors.white)),
      actions: trailing == null ? null : [trailing!],
    );
  }
}
