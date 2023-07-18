import 'package:desktop_webview_window/desktop_webview_window.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
// import 'package:multi_window/multi_window.dart';

import '../../providers/signin_state.dart';

import '../../widgets/mini-app-bar.dart';
import '../../widgets/wave.dart';
import 'views/email_view.dart';
import 'views/password_view.dart';
import 'views/welcome.dart';

class SignInPage extends StatefulWidget {
  final String title;

  const SignInPage({Key? key, required this.title}) : super(key: key);
  @override
  _SignInPageState createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
   bool? _webviewAvailable;



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black.withOpacity(0.6),
      appBar: const PreferredSize(
          preferredSize: Size.fromHeight(35), child: MiniAppBar()),
      body: Stack(
        children: const [
          Positioned.fill(
            child: WaveBackground(
              fade: true,
            ),
          ),
          SignInScreen()
        ],
      ),
    );
  }


}

class SignInScreen extends HookConsumerWidget {
  const SignInScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(signupStateProvider);
    final tab = state.tab;
    return Builder(
      builder: (_) {
        switch (tab) {
          case SignUpScreenTab.welcome:
            return const WelcomePage(
              title: '',
            );
          case SignUpScreenTab.email:
            return const EmailView();
          case SignUpScreenTab.password:
            return const PasswordView();
          default:
            print('default');
            return const WelcomePage(
              title: '',
            );
        }
      },
    );
  }
}
