import 'package:flutter/material.dart';
import '../widgets/sigin_button.dart';

class WelcomePage extends StatefulWidget {
  final String title;

  const WelcomePage({Key? key, required this.title}) : super(key: key);
  @override
  _WelcomePageState createState() => _WelcomePageState();
}

class _WelcomePageState extends State<WelcomePage> {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(
            'assets/images/caramel_logo.png',
            width: 60,
            height: 60,
          ),
          const Text(
            'Welcome',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          const SignupButton(
            index: 0,
            label: 'Finish',
            formkey: null,
            titleEditingController: null,
            codeEditingController: null,
          )
        ],
      ),
    );
  }
}
