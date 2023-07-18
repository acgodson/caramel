import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../utils/keys.dart';
import '../utils/routes.dart';
import '../widgets/home_controller.dart';

class AuthService {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;

  // final DatabaseService service = DatabaseService();

  Stream<String> get onAuthStateChanged => _firebaseAuth.authStateChanges().map(
        (User? user) => user!.uid,
      );

  Future updateUserName(String name, User currentUser) async {
    await currentUser.updateDisplayName(name);
    await currentUser.reload();
  }

  Future signInEmailUser(String email, String password) async {
    try {
      await _firebaseAuth.signInWithEmailAndPassword(
          email: email, password: password);

      Navigator.push(navigatorKey.currentState!.overlay!.context,
          MaterialPageRoute(builder: (context) => const HomeController()));
      print("User is signed in");
    } on FirebaseAuthException catch (e) {
      snackbarKey.currentState!.showSnackBar(SnackBar(
          content: Text(
            e.message!,
          ),
          duration: const Duration(milliseconds: 4000)));
    } catch (e) {
      print(e);
    }
  }

  Future<bool> checkUser(String email) async {
    //Check the database for any such user with that uid
    FirebaseFirestore.instance
        .collection("users")
        .where("email", isEqualTo: email)
        .get()
        .then(
      (res) {
        print("Successfully queried");
        if (res.docs.isNotEmpty) {
          print(true);
          return true;
        } else {
          print(false);
          throw ("User not found");
        }
      },
      onError: (e) => print("Error completing: $e"),
    );

    return false;
  }

  Future<UserCredential?> signUpUser(String email, String password) async {
    try {
      final userCredential = await _firebaseAuth.createUserWithEmailAndPassword(
          email: email, password: password);

//let's launch the outer window


      return userCredential;
    } on FirebaseAuthException catch (e) {
      snackbarKey.currentState!.showSnackBar(SnackBar(
        content: Text(e.message!),
        duration: const Duration(milliseconds: 4000),
      ));
    } catch (e) {
      print(e);
    }
    return null; // Return null in case of any error
  }

  Future getCurrentUID() async {
    return _firebaseAuth.currentUser?.uid;
  }

  // Future<String> getName() async {
  //   return _firebaseAuth.currentUser!.displayName!;
  // }

  Future getCurrentPhone() async {
    return _firebaseAuth.currentUser?.phoneNumber;
  }

  signOut() {
    return _firebaseAuth.signOut();
  }

// Reset Password
  Future sendPasswordResetEmail(String email) async {
    return _firebaseAuth.sendPasswordResetEmail(email: email);
  }
}
