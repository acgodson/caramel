import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../utils/routes.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  // SplashScreen({Key? key, this.title}) : super(key: key);
  startTime() async {
    var _duration = const Duration(milliseconds: 4000); //SetUp duration here
    return Timer(_duration, navigationPage);
  }

  void navigationPage() {
    if (FirebaseAuth.instance.currentUser == null) {
      Navigator.pushNamed(context, OCDRoutes.auth);
    } else {
      Navigator.pushNamed(context, OCDRoutes.home);
    }
  }

  @override
  void initState() {
    super.initState();
    startTime();
  }



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: <Widget>[
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Center(
                child: CircularProgressIndicator(),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
