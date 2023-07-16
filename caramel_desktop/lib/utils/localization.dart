import 'dart:async';

import 'package:flutter/material.dart';

class OCDLocalizations {
  static OCDLocalizations? of(BuildContext context) {
    return Localizations.of<OCDLocalizations>(context, OCDLocalizations);
  }

  String get appTitle => 'Caramel';
}

class OCDLocalizationsDelegate extends LocalizationsDelegate<OCDLocalizations> {
  @override
  Future<OCDLocalizations> load(Locale locale) =>
      Future(() => OCDLocalizations());

  @override
  bool shouldReload(OCDLocalizationsDelegate old) => false;

  @override
  bool isSupported(Locale locale) =>
      locale.languageCode.toLowerCase().contains('en');
}
