import 'package:flutter/material.dart';
import '../theme.dart';
import '../services/admin_api.dart';

final _demo = [
  Submission(id: 'demo-1', name: 'Ananya Rao', email: 'ananya@example.com', status: 'pending'),
  Submission(id: 'demo-2', name: 'Rahul Nair', email: 'rahul@example.com', status: 'pending'),
];

class AdminVerifyScreen extends StatefulWidget {
  final void Function(String screen) navigate;
  const AdminVerifyScreen({super.key, required this.navigate});
  @override
  State<AdminVerifyScreen> createState() => _AdminVerifyScreenState();
}

class _AdminVerifyScreenState extends State<AdminVerifyScreen> {
  List<Submission> items = [];
  bool loading = true;
  bool demo = false;

  @override
  void initState() {
    super.initState();
    load();
  }

  Future<void> load() async {
    try {
      final data = await AdminApi.listSubmissions();
      setState(() {
        items = data.isEmpty ? _demo : data;
        demo = data.isEmpty;
        loading = false;
      });
    } catch (_) {
      setState(() {
        items = _demo;
        demo = true;
        loading = false;
      });
    }
  }

  Future<void> decide(Submission s, String status) async {
    setState(() {
      final i = items.indexWhere((x) => x.id == s.id);
      items[i] = Submission(id: s.id, name: s.name, email: s.email, status: status, fileId: s.fileId);
    });
    if (!s.id.startsWith('demo-')) await AdminApi.updateStatus(s.id, status).catchError((_) {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RColors.paper,
      appBar: AppBar(
        backgroundColor: RColors.ink,
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: () => widget.navigate('adminLogin')),
        title: Text('ID Verification', style: RText.display(size: 19, weight: FontWeight.w600, color: Colors.white)),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(20),
              children: [
                if (demo)
                  Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                    child: const Text('Showing demo data — set appsScriptUrl in config.dart to load real submissions.', style: TextStyle(color: RColors.inkSoft, fontSize: 13)),
                  ),
                ...items.map(
                  (s) => Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: RColors.paperRaised, borderRadius: BorderRadius.circular(18), border: Border.all(color: RColors.rule)),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          s.fileId != null
                              ? ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: Image.network('https://drive.google.com/thumbnail?id=${s.fileId}&sz=w200', width: 72, height: 72, fit: BoxFit.cover),
                                )
                              : Container(width: 72, height: 72, decoration: BoxDecoration(color: Colors.black.withValues(alpha: 0.05), borderRadius: BorderRadius.circular(12)), child: const Icon(Icons.person_outline, color: RColors.inkSoft)),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(s.name, style: const TextStyle(fontWeight: FontWeight.w700)),
                                Text(s.email, style: RText.sans(size: 13, color: RColors.inkSoft)),
                                const SizedBox(height: 10),
                                if (s.status == 'pending')
                                  Row(
                                    children: [
                                      Expanded(
                                        child: OutlinedButton(
                                          onPressed: () => decide(s, 'rejected'),
                                          style: OutlinedButton.styleFrom(foregroundColor: RColors.coral, side: const BorderSide(color: RColors.coral), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))),
                                          child: const Text('Reject', style: TextStyle(fontSize: 13)),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: FilledButton(
                                          onPressed: () => decide(s, 'approved'),
                                          style: FilledButton.styleFrom(backgroundColor: RColors.ink, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))),
                                          child: const Text('Approve', style: TextStyle(fontSize: 13)),
                                        ),
                                      ),
                                    ],
                                  )
                                else
                                  Container(
                                    width: double.infinity,
                                    padding: const EdgeInsets.symmetric(vertical: 8),
                                    decoration: BoxDecoration(
                                      color: s.status == 'approved' ? RColors.greenSoft : RColors.coralSoft,
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    alignment: Alignment.center,
                                    child: Text(
                                      s.status == 'approved' ? 'Approved' : 'Rejected',
                                      style: TextStyle(color: s.status == 'approved' ? RColors.green : RColors.coral, fontWeight: FontWeight.w700, fontSize: 13),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}
