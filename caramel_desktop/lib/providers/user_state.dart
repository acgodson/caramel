import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

class UserNotifier with ChangeNotifier {
  String? _first;
  String? _last;
  String? _user;
  String? _phone;
  String? _email;
  String? _country;
  String? _date;
  List<String>? _tags;
  String? _createdAt;

  prints() {
    print(_first);
    print(_last);
    print(_user);
    print(_phone);
    print(_email);
    print(_country);
    print(_date);
    print(_tags);
  }

  String? get first => _first;

  String? get last => _last;

  String? get user => _user;

  String? get phone => _phone;

  String? get email => _email;

  String? get country => _country;

  String? get date => _date;

  List<String>? get tags => _tags;

  String? get createdAt => _createdAt;

  set first(String? first) {
    _first = first;
    notifyListeners();
  }

  set last(String? last) {
    _last = last;
    notifyListeners();
  }

  set user(String? user) {
    _user = user;
    notifyListeners();
  }

  set phone(String? phone) {
    _phone = phone;
    notifyListeners();
  }

  set email(String? email) {
    _email = email;
    notifyListeners();
  }

  set country(String? country) {
    _country = country;
    notifyListeners();
  }

  set date(String? date) {
    _date = date;
    notifyListeners();
  }

  set tags(List<String>? tags) {
    _tags = tags;
    notifyListeners();
  }

  set createdAt(String? createdAt) {
    _createdAt = createdAt;
    notifyListeners();
  }
}

final UserStateProvider =
    ChangeNotifierProvider<UserNotifier>((ref) => UserNotifier());
