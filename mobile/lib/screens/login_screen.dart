import 'package:flutter/material.dart';
import '../theme.dart';
import '../widgets/auth_field.dart';
import '../services/otp_service.dart';

class LoginScreen extends StatefulWidget {
  final void Function(String screen) navigate;
  const LoginScreen({super.key, required this.navigate});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final email = TextEditingController();
  final otp = TextEditingController();
  bool showPw = false;
  String otpStatus = ''; // '', sending, sent, error
  String? error;

  Future<void> sendOtp() async {
    if (email.text.isEmpty) return setState(() => error = 'Enter your email first.');
    setState(() {
      error = null;
      otpStatus = 'sending';
    });
    try {
      await OtpService.send(email.text);
      setState(() => otpStatus = 'sent');
    } catch (_) {
      setState(() => otpStatus = 'error');
    }
  }

  void submit() {
    if (otp.text.isNotEmpty) {
      final err = OtpService.verify(email.text, otp.text);
      if (err != null) return setState(() => error = err);
    }
    widget.navigate('home');
  }

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
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(color: RColors.ink, borderRadius: BorderRadius.circular(20)),
                  child: const Icon(Icons.directions_car_filled, color: Colors.white, size: 36),
                ),
                const SizedBox(height: 16),
                Text('Ridify', style: RText.display(size: 34, weight: FontWeight.w800)),
                const SizedBox(height: 32),
                AuthField(icon: Icons.mail_outline, placeholder: 'Email', controller: email, keyboardType: TextInputType.emailAddress),
                const SizedBox(height: 14),
                AuthField(
                  icon: Icons.lock_outline,
                  placeholder: 'Password',
                  obscure: !showPw,
                  trailing: IconButton(
                    icon: Icon(showPw ? Icons.visibility_outlined : Icons.visibility_off_outlined, color: const Color(0xFF9CA3AF)),
                    onPressed: () => setState(() => showPw = !showPw),
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    const Expanded(child: Divider(color: RColors.rule)),
                    const Padding(padding: EdgeInsets.symmetric(horizontal: 12), child: Text('OR', style: TextStyle(fontWeight: FontWeight.w700, color: RColors.inkSoft))),
                    const Expanded(child: Divider(color: RColors.rule)),
                  ],
                ),
                const SizedBox(height: 14),
                AuthField(
                  icon: Icons.shield_outlined,
                  placeholder: 'OTP',
                  controller: otp,
                  keyboardType: TextInputType.number,
                  trailing: TextButton(
                    onPressed: otpStatus == 'sending' ? null : sendOtp,
                    child: Text(otpStatus == 'sending' ? 'Sending…' : otpStatus == 'sent' ? 'Resend OTP' : 'Send OTP', style: const TextStyle(color: RColors.inkSoft, fontWeight: FontWeight.w700)),
                  ),
                ),
                if (otpStatus == 'sent') _hint('OTP sent to ${email.text}.', RColors.green),
                if (otpStatus == 'error') _hint("Couldn't send OTP. Check EmailJS setup.", RColors.coral),
                if (error != null) _hint(error!, RColors.coral),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: submit,
                    style: FilledButton.styleFrom(backgroundColor: RColors.ink, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32))),
                    child: const Text('Log In', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
                  ),
                ),
                const SizedBox(height: 16),
                Wrap(
                  alignment: WrapAlignment.center,
                  children: [
                    const Text("Don't have an account? ", style: TextStyle(color: RColors.inkSoft)),
                    GestureDetector(onTap: () => widget.navigate('signup'), child: const Text('Sign up', style: TextStyle(fontWeight: FontWeight.w800))),
                  ],
                ),
                const SizedBox(height: 24),
                GestureDetector(
                  onTap: () => widget.navigate('adminLogin'),
                  child: Text('Admin login', style: TextStyle(color: RColors.inkSoft.withValues(alpha: 0.6), fontSize: 13)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _hint(String text, Color color) => Padding(
        padding: const EdgeInsets.only(top: 6),
        child: Align(alignment: Alignment.centerLeft, child: Text(text, style: TextStyle(color: color, fontSize: 13))),
      );
}
