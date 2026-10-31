import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../config.dart';

class Submission {
  final String id, name, email, status;
  final String? fileId;
  Submission({required this.id, required this.name, required this.email, required this.status, this.fileId});

  factory Submission.fromJson(List row) => Submission(
        id: row[0].toString(),
        name: row[2].toString(),
        email: row[3].toString(),
        fileId: row[4]?.toString(),
        status: row[6].toString(),
      );
}

/// Talks to the Apps Script web app in backend/appsscript/Code.gs — same
/// endpoint the React build uses, so both admin views share one source of
/// truth (a Google Sheet + Drive folder).
class AdminApi {
  static Future<Map<String, dynamic>> uploadVerification({required String name, required String email, required File file}) async {
    final bytes = await file.readAsBytes();
    final res = await http.post(
      Uri.parse(Config.appsScriptUrl),
      headers: {'Content-Type': 'text/plain;charset=utf-8'},
      body: jsonEncode({
        'action': 'upload',
        'name': name,
        'email': email,
        'fileName': file.path.split('/').last,
        'mimeType': 'image/jpeg',
        'data': base64Encode(bytes),
      }),
    );
    return jsonDecode(res.body);
  }

  static Future<List<Submission>> listSubmissions() async {
    final res = await http.get(Uri.parse('${Config.appsScriptUrl}?action=list'));
    final body = jsonDecode(res.body);
    final items = (body['items'] as List?) ?? [];
    return items.map((r) => Submission.fromJson(r as List)).toList();
  }

  static Future<void> updateStatus(String id, String status) async {
    await http.post(
      Uri.parse(Config.appsScriptUrl),
      headers: {'Content-Type': 'text/plain;charset=utf-8'},
      body: jsonEncode({'action': 'updateStatus', 'id': id, 'status': status}),
    );
  }
}
