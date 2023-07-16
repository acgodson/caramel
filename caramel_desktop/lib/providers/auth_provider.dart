import 'package:flutter/material.dart';

import '../services/auth_service.dart';

class AuthProvider extends InheritedWidget {
  final AuthService? auth;
  // ignore: prefer_typing_uninitialized_variables
  final db;
  // ignore: prefer_typing_uninitialized_variables
  final fm;

  AuthProvider({Key? key, Widget? child, this.auth, this.db, this.fm})
      : super(key: key, child: child!);

  @override
  bool updateShouldNotify(InheritedWidget oldWidget) {
    return true;
  }

  static AuthProvider? of(BuildContext context) =>
      (context.dependOnInheritedWidgetOfExactType<AuthProvider>());
}
