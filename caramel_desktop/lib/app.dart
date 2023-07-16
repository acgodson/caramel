import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:multi_window/multi_window.dart';

import 'providers/auth_provider.dart';
import 'screens/auth/signin.dart';
import 'screens/auth/wait.dart';
import 'screens/home/home_mini.dart';
import 'services/auth_service.dart';
import 'utils/localization.dart';
import 'utils/routes.dart';
import 'widgets/home_controller.dart';
// import 'package:path/path.dart' as p;
// import 'package:path_provider/path_provider.dart';

class OCDApp extends StatefulWidget {
  const OCDApp({Key? key}) : super(key: key);

  @override
  State<OCDApp> createState() => _OCDAppState();
}

class _OCDAppState extends State<OCDApp> {
  @override
  Widget build(BuildContext context) {
    return AuthProvider(
      auth: AuthService(),
      db: FirebaseFirestore.instance,
      child: MaterialApp(
          debugShowCheckedModeBanner: false,
          localizationsDelegates: [
            OCDLocalizationsDelegate(),
          ],
          onGenerateTitle: (context) => OCDLocalizations.of(context)!.appTitle,
          routes: {
            OCDRoutes.home: (ctx) => const HomePage(
                  balance: 0,
                  walletAddress: '',
                ),
            OCDRoutes.auth: (ctx) => const SignInPage(
                  title: 'Caramel',
                ),
            OCDRoutes.wait: (ctx) => const WaitPage(
                  title: 'Caramel',
                ),
          },
          onGenerateRoute: (RouteSettings settings) {
            return MaterialPageRoute(
                builder: (context) {
                  switch (MultiWindow.current.key) {
                    case 'main':
                      return const HomeController();
                    // case 'signin':
                    //   return const WaitPage(
                    //     title: 'time to sign in',
                    //   );
                    default:
                      return const HomeController();
                  }
                },
                settings: (RouteSettings(name: settings.name)));
          }),
    );
  }
}
