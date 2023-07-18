import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

enum SignUpScreenTab { welcome, email, password }

class SignUpNotifier with ChangeNotifier {
  SignUpScreenTab _tab = SignUpScreenTab.welcome;

  String? _email;
  String? _password;
  bool? _exists;
  String? _url;

  SignUpScreenTab get tab => _tab;

  String? get email => _email;

  String? get password => _password;

  bool? get exists => _exists;
  String? get url => _url;

  set tab(SignUpScreenTab tab) {
    _tab = tab;
    notifyListeners();
  }

  set email(String? email) {
    _email = email;
    notifyListeners();
  }

  set password(String? password) {
    _password = password;
    notifyListeners();
  }

  set exists(bool? exists) {
    _exists = exists;
    notifyListeners();
  }

  set url(String? url) {
    _url = url;
    notifyListeners();
  }
}

final signupStateProvider =
    ChangeNotifierProvider<SignUpNotifier>((ref) => SignUpNotifier());
