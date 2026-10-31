import 'package:flutter/material.dart';
import '../theme.dart';
import '../data/mock_data.dart';

class ProfileScreen extends StatefulWidget {
  final VoidCallback onLogout;
  const ProfileScreen({super.key, required this.onLogout});
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool dark = false;
  late final Map<String, TextEditingController> fields = {
    'Name': TextEditingController(text: Me.name),
    'Age': TextEditingController(text: '${Me.age}'),
    'Email': TextEditingController(text: Me.email),
    'Password': TextEditingController(text: '••••••••'),
  };
  String? editing;

  static const icons = {'Name': Icons.person_outline, 'Age': Icons.cake_outlined, 'Email': Icons.mail_outline, 'Password': Icons.lock_outline};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RColors.paper,
      appBar: AppBar(
        backgroundColor: RColors.ink,
        automaticallyImplyLeading: false,
        titleSpacing: 20,
        title: Row(children: [Text('Ridify', style: RText.display(size: 22, weight: FontWeight.w800, color: Colors.white)), const SizedBox(width: 8), const Icon(Icons.directions_car_filled, color: Colors.white, size: 26)]),
        actions: [IconButton(icon: Icon(dark ? Icons.nightlight : Icons.nightlight_outlined, color: dark ? RColors.signal : Colors.white), onPressed: () => setState(() => dark = !dark))],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('My Profile', style: RText.display(size: 24, weight: FontWeight.w700)),
          const SizedBox(height: 24),
          Center(
            child: Stack(
              children: [
                CircleAvatar(radius: 48, backgroundColor: RColors.ink, child: Text(Me.initial, style: const TextStyle(color: Colors.white, fontSize: 30, fontWeight: FontWeight.w700))),
                const Positioned(right: 0, bottom: 0, child: Icon(Icons.verified, color: RColors.green, size: 24)),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Center(child: Text(fields['Name']!.text, style: RText.display(size: 20, weight: FontWeight.w700))),
          const Center(child: Text('Verified', style: TextStyle(color: RColors.green, fontWeight: FontWeight.w600))),
          const SizedBox(height: 24),
          ...fields.entries.map((e) => _field(e.key)),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: widget.onLogout,
              icon: const Icon(Icons.logout, color: RColors.coral, size: 18),
              label: const Text('Logout', style: TextStyle(color: RColors.coral, fontWeight: FontWeight.w700)),
              style: OutlinedButton.styleFrom(side: const BorderSide(color: RColors.coral), padding: const EdgeInsets.symmetric(vertical: 14), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32))),
            ),
          ),
        ],
      ),
    );
  }

  Widget _field(String key) {
    final isEditing = editing == key;
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        children: [
          Icon(icons[key], color: RColors.inkSoft, size: 20),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(key, style: RText.sans(size: 13, color: RColors.inkSoft)),
                isEditing
                    ? TextField(
                        controller: fields[key],
                        autofocus: true,
                        obscureText: key == 'Password',
                        onSubmitted: (_) => setState(() => editing = null),
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
                        decoration: const InputDecoration(isDense: true, border: UnderlineInputBorder()),
                      )
                    : Text(key == 'Password' ? '••••••••' : fields[key]!.text, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.edit_outlined, size: 18, color: RColors.inkSoft),
            onPressed: () => setState(() => editing = isEditing ? null : key),
          ),
        ],
      ),
    );
  }
}
