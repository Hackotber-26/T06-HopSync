import 'package:flutter/material.dart';
import '../theme.dart';

/// "Now" skips date/time entirely — most last-mile rides are walk-up, not
/// booked ahead. "Later" reveals the pickers for anyone scheduling a return.
class ScheduleField extends StatefulWidget {
  const ScheduleField({super.key});
  @override
  State<ScheduleField> createState() => _ScheduleFieldState();
}

class _ScheduleFieldState extends State<ScheduleField> {
  String when = 'now';

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Schedule', style: RText.sans(weight: FontWeight.w600)),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: RColors.paperRaised,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: RColors.rule),
          ),
          child: Row(
            children: ['now', 'later'].map((id) {
              final active = when == id;
              return Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => when = id),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      color: active ? RColors.ink : Colors.transparent,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      id[0].toUpperCase() + id.substring(1),
                      style: TextStyle(color: active ? Colors.white : RColors.inkSoft, fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 12),
        if (when == 'now')
          Text("Leaving right away — we'll match you with riders here now.", style: RText.sans(color: RColors.inkSoft))
        else
          Row(
            children: [
              Expanded(child: _pickerBox(Icons.calendar_today_outlined, 'dd/mm/yyyy')),
              const SizedBox(width: 12),
              Expanded(child: _pickerBox(Icons.access_time, '--:--')),
            ],
          ),
      ],
    );
  }

  Widget _pickerBox(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      decoration: BoxDecoration(
        color: RColors.paperRaised,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: RColors.rule),
      ),
      child: Row(children: [Icon(icon, size: 18, color: RColors.inkSoft), const SizedBox(width: 8), Text(label, style: const TextStyle(color: RColors.inkSoft))]),
    );
  }
}
