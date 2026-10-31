import 'dart:convert';
import 'dart:math';
import 'package:http/http.dart' as http;
import '../config.dart';

/// Demo-only: the code lives in memory on the client. A real deployment
/// would generate and check this on the backend instead.
class OtpService {
  static String? _email;
  static String? _code;
  static DateTime? _expiresAt;

  static Future<void> send(String email) async {
    final passcode = (100000 + Random().nextInt(900000)).toString();
    final expiresAt = DateTime.now().add(const Duration(minutes: 15));
    final time = '${expiresAt.hour.toString().padLeft(2, '0')}:${expiresAt.minute.toString().padLeft(2, '0')}';

    final res = await http.post(
      Uri.parse('https://api.emailjs.com/api/v1.0/email/send'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'service_id': Config.emailjsServiceId,
        'template_id': Config.emailjsOtpTemplateId,
        'user_id': Config.emailjsPublicKey,
        'template_params': {'email': email, 'passcode': passcode, 'time': time},
      }),
    );
    if (res.statusCode >= 300) throw Exception('EmailJS send failed: ${res.body}');

    _email = email;
    _code = passcode;
    _expiresAt = expiresAt;
  }

  /// Returns an error message, or null if the code is correct.
  static String? verify(String email, String code) {
    if (_code == null) return 'Request an OTP first.';
    if (_email != email) return 'Send a new OTP for this email.';
    if (DateTime.now().isAfter(_expiresAt!)) return 'OTP expired — send a new one.';
    return _code == code ? null : 'Incorrect OTP.';
  }
}
