import 'package:flutter/material.dart';
import '../theme.dart';
import '../widgets/app_header.dart';
import '../data/mock_data.dart';

class HomeScreen extends StatelessWidget {
  final void Function(String screen) navigate;
  const HomeScreen({super.key, required this.navigate});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const BrandHeader(),
      backgroundColor: RColors.paper,
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Hello, ${Me.name}! 👋', style: RText.display(size: 24, weight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text("Let's make your commute better together.", style: RText.sans(color: RColors.inkSoft)),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: _actionCard(
                  dark: true,
                  icon: Icons.directions_car,
                  title: 'Offer a Ride',
                  subtitle: 'Share your journey',
                  onTap: () => navigate('offerRide'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _actionCard(
                  dark: false,
                  icon: Icons.search,
                  title: 'Find a Ride',
                  subtitle: "Get where you're headed",
                  onTap: () => navigate('findRide'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: _statCard(Icons.arrow_downward, 'Total Earnings', HomeStats.totalEarnings, RColors.green, RColors.greenSoft)),
              const SizedBox(width: 12),
              Expanded(child: _statCard(Icons.arrow_upward, 'Total Spending', HomeStats.totalSpending, RColors.coral, RColors.coralSoft)),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: const Color(0xFFE7F1FC), borderRadius: BorderRadius.circular(16)),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.shield, color: Color(0xFF2F7DD9)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Safety First', style: TextStyle(color: Color(0xFF2F7DD9), fontWeight: FontWeight.w700)),
                      const SizedBox(height: 4),
                      Text("Always verify your co-passenger's details and share your ride details with your family or friends.", style: RText.sans(size: 14)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: null,
    );
  }

  Widget _actionCard({required bool dark, required IconData icon, required String title, required String subtitle, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(16),
        height: 150,
        decoration: BoxDecoration(
          color: dark ? RColors.ink : RColors.paperRaised,
          borderRadius: BorderRadius.circular(18),
          border: dark ? null : Border.all(color: RColors.rule),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: dark ? Colors.white : RColors.ink, size: 24),
            const Spacer(),
            Text(title, style: TextStyle(color: dark ? Colors.white : RColors.ink, fontWeight: FontWeight.w700, fontSize: 15)),
            const SizedBox(height: 2),
            Text(subtitle, style: TextStyle(color: dark ? Colors.white60 : RColors.inkSoft, fontSize: 13)),
          ],
        ),
      ),
    );
  }

  Widget _statCard(IconData icon, String label, int value, Color color, Color bg) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(18)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(radius: 16, backgroundColor: Colors.white70, child: Icon(icon, color: color, size: 16)),
          const SizedBox(height: 10),
          Text(label, style: TextStyle(color: color, fontWeight: FontWeight.w700, fontSize: 13)),
          const SizedBox(height: 4),
          Text('₹$value', style: RText.display(size: 20, weight: FontWeight.w700)),
        ],
      ),
    );
  }
}
