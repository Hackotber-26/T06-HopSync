import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Ridify design tokens — kept in one place so Flutter matches the web
/// build exactly: near-white background/cards, ink-navy chrome, a single
/// transit-amber accent, and desaturated metro-line colors used only as
/// small identifiers.
class RColors {
  static const ink = Color(0xFF14171C);
  static const inkSoft = Color(0xFF52555C);
  static const paper = Color(0xFFF7F7F8);
  static const paperRaised = Color(0xFFFFFFFF);
  static const rule = Color(0xFFE5E5E7);
  static const signal = Color(0xFFFFC43D);
  static const signalInk = Color(0xFF3A2A00);
  static const green = Color(0xFF1F8A5F);
  static const greenSoft = Color(0xFFE4F3EC);
  static const coral = Color(0xFFD64933);
  static const coralSoft = Color(0xFFFBE8E3);
  static const linePurple = Color(0xFF6B3FA0);
  static const lineGreen = Color(0xFF2E8B57);
  static const lineYellow = Color(0xFFB5860B);
  static const linePink = Color(0xFFC23B78);
}

class RText {
  static TextStyle display({double size = 20, FontWeight weight = FontWeight.w700, Color color = RColors.ink}) =>
      GoogleFonts.spaceGrotesk(fontSize: size, fontWeight: weight, color: color);

  static TextStyle sans({double size = 15, FontWeight weight = FontWeight.w400, Color color = RColors.ink}) =>
      GoogleFonts.ibmPlexSans(fontSize: size, fontWeight: weight, color: color);

  static TextStyle mono({double size = 15, FontWeight weight = FontWeight.w500, Color color = RColors.ink}) =>
      GoogleFonts.ibmPlexMono(fontSize: size, fontWeight: weight, color: color);
}

ThemeData ridifyTheme() {
  return ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: RColors.paper,
    fontFamily: GoogleFonts.ibmPlexSans().fontFamily,
    colorScheme: ColorScheme.fromSeed(seedColor: RColors.ink, surface: RColors.paper),
    textTheme: GoogleFonts.ibmPlexSansTextTheme(),
  );
}
