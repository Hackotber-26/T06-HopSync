import 'package:flutter/material.dart';
import '../theme.dart';
import '../widgets/auth_field.dart';

// No real auth here (same dummy pattern as Login/Signup) — it just gates
// entry into the admin area for the demo.
class AdminLoginScreen extends StatelessWidget {
  final void Function(String screen) navigate;
  const AdminLoginScreen({super.key, required this.navigate});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RColors.paper,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
            child: Column(
              children: [
                Container(width: 80, height: 80, decoration: BoxDecoration(color: RColors.ink, borderRadius: BorderRadius.circular(20)), child: const Icon(Icons.directions_car_filled, color: Colors.white, size: 36)),
                const SizedBox(height: 16),
                Text('Ridify', style: RText.display(size: 34, weight: FontWeight.w800)),
                Text('Admin console', style: RText.sans(color: RColors.inkSoft)),
                const SizedBox(height: 32),
                const AuthField(icon: Icons.mail_outline, placeholder: 'Admin email', keyboardType: TextInputType.emailAddress),
                const SizedBox(height: 14),
                const AuthField(icon: Icons.lock_outline, placeholder: 'Password', obscure: true),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: () => navigate('adminVerify'),
                    style: FilledButton.styleFrom(backgroundColor: RColors.ink, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32))),
                    child: const Text('Log In', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
                  ),
                ),
                const SizedBox(height: 16),
                GestureDetector(onTap: () => navigate('login'), child: const Text('Back to app', style: TextStyle(fontWeight: FontWeight.w800))),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
