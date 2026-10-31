import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../theme.dart';
import '../widgets/app_header.dart';

const _center = LatLng(12.9767, 77.6038);

const _suggestions = {
  'pickup': ['Baiyappanahalli Metro · Gate A', 'MG Road Metro · Gate 1', 'Whitefield Metro · Gate A', 'Silk Board Metro · Gate 1'],
  'destination': ['Bagmane Tech Park', 'ITPL Main Gate', 'HSR Layout Sector 1', 'Koramangala 5th Block'],
};

/// A single pin-drop picker shared by the pickup and destination map icons,
/// backed by real OpenStreetMap tiles.
class MapPickerScreen extends StatefulWidget {
  final String field;
  final VoidCallback onBack;
  final void Function(String label) onConfirm;
  const MapPickerScreen({super.key, required this.field, required this.onBack, required this.onConfirm});
  @override
  State<MapPickerScreen> createState() => _MapPickerScreenState();
}

class _MapPickerScreenState extends State<MapPickerScreen> {
  final query = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final isPickup = widget.field == 'pickup';
    final suggestions = _suggestions[widget.field]!;
    return Scaffold(
      backgroundColor: RColors.paper,
      appBar: NavHeader(title: 'Set ${isPickup ? 'pickup' : 'destination'}', onBack: widget.onBack),
      body: Column(
        children: [
          Container(
            color: RColors.paperRaised,
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 10),
            child: TextField(
              controller: query,
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.search, size: 18),
                hintText: isPickup ? 'Search pickup location' : 'Search destination',
                filled: true,
                fillColor: RColors.paper,
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
              ),
            ),
          ),
          Expanded(
            child: Stack(
              alignment: Alignment.center,
              children: [
                FlutterMap(
                  options: const MapOptions(initialCenter: _center, initialZoom: 15),
                  children: [TileLayer(urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', userAgentPackageName: 'com.ridify.mobile')],
                ),
                IgnorePointer(child: Icon(isPickup ? Icons.location_on : Icons.flag, color: isPickup ? RColors.green : RColors.coral, size: 40)),
                Positioned(
                  bottom: 16,
                  right: 16,
                  child: Container(width: 40, height: 40, decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 4)]), child: const Icon(Icons.my_location, size: 18)),
                ),
              ],
            ),
          ),
          Container(
            color: RColors.paperRaised,
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Suggested', style: TextStyle(color: RColors.inkSoft, fontSize: 13)),
                const SizedBox(height: 8),
                ...suggestions.map(
                  (s) => InkWell(
                    onTap: () => widget.onConfirm(s),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      child: Row(children: [Icon(isPickup ? Icons.location_on : Icons.flag, size: 16, color: isPickup ? RColors.green : RColors.coral), const SizedBox(width: 12), Text(s, style: const TextStyle(fontSize: 15))]),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: () => widget.onConfirm(query.text.trim().isEmpty ? suggestions.first : query.text.trim()),
                    style: FilledButton.styleFrom(backgroundColor: RColors.ink, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32))),
                    child: Text('Confirm ${isPickup ? 'pickup' : 'destination'}', style: const TextStyle(fontWeight: FontWeight.w700)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
