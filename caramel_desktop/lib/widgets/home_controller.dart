import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../models/user_data.dart';
import '../providers/auth_provider.dart';
import '../providers/user_state.dart';
import '../services/auth_service.dart';
import '../utils/routes.dart';
import 'splash_screen.dart';

class HomeController extends HookConsumerWidget {
  const HomeController({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(UserStateProvider);

    final AuthService? auth = AuthProvider.of(context)?.auth;

    return StreamBuilder(
        stream: auth!.onAuthStateChanged,
        builder: (context, AsyncSnapshot<String> snapshot) {
          if (snapshot.connectionState == ConnectionState.active) {
            ///If a user is signed in
            if (snapshot.hasData) {
              final uid = FirebaseAuth.instance.currentUser!.uid;
              final docRef =
                  FirebaseFirestore.instance.collection("users").doc(uid);
              docRef
                  .get()
                  .then((DocumentSnapshot<Map<String, dynamic>> doc) async {
                if (doc.exists) {
                  final data = doc;
                  //Fetch userData from db
                  state.first ??= UserData.fromDocumentSnapshot(data).first;
                  state.last ??= UserData.fromDocumentSnapshot(data).last;
                  state.email ??= UserData.fromDocumentSnapshot(data).email;
                  state.phone ??= UserData.fromDocumentSnapshot(data).phone;
                  state.user ??= UserData.fromDocumentSnapshot(data).user;
                  state.date ??= UserData.fromDocumentSnapshot(data).date;
                  state.tags ??= UserData.fromDocumentSnapshot(data).tags;
                  state.createdAt ??=
                      UserData.fromDocumentSnapshot(data).createdAt;
                  Navigator.pushNamed(context, OCDRoutes.home);
                }
              });
            }
          }
          return const SplashScreen();
        });
  }
}
