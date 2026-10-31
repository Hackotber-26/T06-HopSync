import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../theme.dart';
import '../widgets/auth_field.dart';
import '../services/otp_service.dart';
import '../services/admin_api.dart';

class SignupScreen extends StatefulWidget {
  final void Function(String screen) navigate;
  const SignupScreen({super.key, required this.navigate});
  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final name = TextEditingController();
  final age = TextEditingController();
  final email = TextEditingController();
  final otp = TextEditingController();
  bool showPw = false;
  String otpStatus = '';
  String uploadStatus = ''; // '', uploading, done, error
  File? idFile;
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

  Future<void> pickFile() async {
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery, imageQuality: 80);
    if (picked != null) setState(() => idFile = File(picked.path));
  }

  Future<void> submit() async {
    if (otp.text.isNotEmpty) {
      final err = OtpService.verify(email.text, otp.text);
      if (err != null) return setState(() => error = err);
    }
    if (idFile != null) {
      setState(() {
        error = null;
        uploadStatus = 'uploading';
      });
      try {
        await AdminApi.uploadVerification(name: name.text, email: email.text, file: idFile!);
        setState(() => uploadStatus = 'done');
      } catch (_) {
        setState(() {
          uploadStatus = 'error';
          error = "Couldn't upload your ID. Check the Apps Script setup, or try again.";
        });
        return;
      }
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
                AuthField(icon: Icons.person_outline, placeholder: 'Full Name', controller: name),
                const SizedBox(height: 14),
                AuthField(icon: Icons.cake_outlined, placeholder: 'Age', controller: age, keyboardType: TextInputType.number),
                const SizedBox(height: 14),
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
                const SizedBox(height: 14),
                InkWell(
                  onTap: pickFile,
                  child: Container(
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                    child: Row(
                      children: [
                        const Icon(Icons.upload_file_outlined, size: 20, color: Color(0xFF9CA3AF)),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            idFile != null ? idFile!.path.split('/').last : 'Upload ID for verification (optional)',
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(color: Color(0xFF9CA3AF)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                if (uploadStatus == 'uploading') _hint('Uploading ID…', RColors.inkSoft),
                if (uploadStatus == 'done') _hint('ID uploaded — pending admin review.', RColors.green),
                if (error != null) _hint(error!, RColors.coral),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: submit,
                    style: FilledButton.styleFrom(backgroundColor: RColors.ink, padding: const EdgeInsets.symmetric(vertical: 16), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(32))),
                    child: const Text('Create Account', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
                  ),
                ),
                const SizedBox(height: 16),
                Wrap(
                  alignment: WrapAlignment.center,
                  children: [
                    const Text('Already have an account? ', style: TextStyle(color: RColors.inkSoft)),
                    GestureDetector(onTap: () => widget.navigate('login'), child: const Text('Log in', style: TextStyle(fontWeight: FontWeight.w800))),
                  ],
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
