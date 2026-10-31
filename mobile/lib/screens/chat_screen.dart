import 'package:flutter/material.dart';
import '../theme.dart';
import '../data/mock_data.dart';

class ChatMessage {
  final String from, text, time;
  ChatMessage(this.from, this.text, this.time);
}

class ChatScreen extends StatefulWidget {
  final VoidCallback onBack;
  const ChatScreen({super.key, required this.onBack});
  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final controller = TextEditingController();
  final messages = [
    ChatMessage('them', "I'm at Gate A, by the ticket counter.", '6:48 PM'),
    ChatMessage('me', 'On my way, 2 minutes out!', '6:49 PM'),
    ChatMessage('them', "No rush, I'll wait near the yellow pillar.", '6:49 PM'),
  ];

  void send() {
    if (controller.text.trim().isEmpty) return;
    setState(() => messages.add(ChatMessage('me', controller.text.trim(), 'Now')));
    controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RColors.paper,
      appBar: AppBar(
        backgroundColor: RColors.ink,
        leading: IconButton(icon: const Icon(Icons.arrow_back, color: Colors.white), onPressed: widget.onBack),
        title: Row(
          children: [
            CircleAvatar(radius: 16, backgroundColor: Colors.white, child: Text(LiveRideInfo.driver[0], style: const TextStyle(color: RColors.ink, fontWeight: FontWeight.w700))),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [Text(LiveRideInfo.driver, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15)), const SizedBox(width: 4), const Icon(Icons.verified, size: 13, color: RColors.green)]),
                Text(LiveRideInfo.status, style: const TextStyle(color: Colors.white60, fontSize: 11)),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: messages
                  .map(
                    (m) => Align(
                      alignment: m.from == 'me' ? Alignment.centerRight : Alignment.centerLeft,
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Column(
                          crossAxisAlignment: m.from == 'me' ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                          children: [
                            Container(
                              constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                              decoration: BoxDecoration(
                                color: m.from == 'me' ? RColors.ink : RColors.paperRaised,
                                borderRadius: BorderRadius.circular(18),
                                border: m.from == 'me' ? null : Border.all(color: RColors.rule),
                              ),
                              child: Text(m.text, style: TextStyle(color: m.from == 'me' ? Colors.white : RColors.ink, fontSize: 15)),
                            ),
                            Padding(padding: const EdgeInsets.only(top: 4), child: Text(m.time, style: const TextStyle(color: RColors.inkSoft, fontSize: 12))),
                          ],
                        ),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
          Container(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 10),
            decoration: const BoxDecoration(color: RColors.paperRaised, border: Border(top: BorderSide(color: RColors.rule))),
            child: SafeArea(
              top: false,
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: controller,
                      decoration: InputDecoration(
                        hintText: 'Message ${LiveRideInfo.driver}…',
                        filled: true,
                        fillColor: RColors.paper,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: const BorderSide(color: RColors.rule)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  InkWell(
                    onTap: send,
                    child: Container(width: 46, height: 46, decoration: const BoxDecoration(color: RColors.ink, shape: BoxShape.circle), child: const Icon(Icons.send, color: Colors.white, size: 18)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
