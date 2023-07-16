import 'package:desktop_webview_window/desktop_webview_window.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
// import 'package:multi_window/multi_window.dart';

import '../../utils/constants.dart';

import '../../widgets/mini-app-bar.dart';
import '../../widgets/wave.dart';

class SignInPage extends StatefulWidget {
  final String title;

  const SignInPage({Key? key, required this.title}) : super(key: key);
  @override
  _SignInPageState createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  final TextEditingController _controller = TextEditingController(
    text: 'https://a27d-105-112-33-188.ngrok-free.app/',
  );

  bool? _webviewAvailable;

  @override
  void initState() {
    super.initState();
    WebviewWindow.isWebviewAvailable().then((value) {
      setState(() {
        _webviewAvailable = value;
      });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black.withOpacity(0.6),
      appBar: const PreferredSize(
          preferredSize: Size.fromHeight(35), child: MiniAppBar()),
      body: Stack(
        children: [
          const Positioned.fill(
            child: WaveBackground(
              fade: true,
            ),
          ),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'Welcome',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 20),
                ElevatedButton.icon(
                  style:
                      ElevatedButton.styleFrom(backgroundColor: Colors.amber),
                  onPressed: () {
                    _onTap();
                    // MultiWindow.current.setTitle("Sign n with google");
                    // Handle sign-in with Google action
                    // Navigator.of(context).pushNamed(OCDRoutes.wait);

                    //   MultiWindow.create(
                    //   'signin',
                    //   // size: Size(100, 100), // Optional size.
                    //   title: 'Sign in with Google', // Optional title.
                    //   alignment: Alignment.center, // Optional alginment
                    // );
                  },
                  icon: const FaIcon(
                    FontAwesomeIcons.google,
                    color: kBlack,
                  ),
                  label: const Padding(
                    padding: EdgeInsets.symmetric(vertical: 8.0),
                    child: Text(
                      'Sign in with Google',
                      style: TextStyle(color: kBlack),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _onTap() async {
    final webview = await WebviewWindow.create(
        // configuration: CreateConfiguration(
        // userDataFolderWindows: await _getWebViewPath(),
        // titleBarTopPadding: Platform.isMacOS ? 20 : 0,
        // ),
        );
    webview
      ..setBrightness(Brightness.dark)
      ..setApplicationNameForUserAgent(" WebviewExample/1.0.0")
      ..launch(_controller.text)
      ..addOnUrlRequestCallback((url) {
        debugPrint('url: $url');
        final uri = Uri.parse(url);
        if (uri.path == '/login_success') {
          debugPrint('login success. token: ${uri.queryParameters['token']}');
          webview.close();
        }
      })
      ..onClose.whenComplete(() {
        debugPrint("on close");
      });
    await Future.delayed(const Duration(seconds: 2));
    for (final javaScript in _javaScriptToEval) {
      try {
        final ret = await webview.evaluateJavaScript(javaScript);
        debugPrint('evaluateJavaScript: $ret');
      } catch (e) {
        debugPrint('evaluateJavaScript error: $e \n $javaScript');
      }
    }
  }
}

const _javaScriptToEval = [
  """
  function test() {
    return;
  }
  test();
  """,
  'eval({"name": "test", "user_agent": navigator.userAgent})',
  '1 + 1',
  'undefined',
  '1.0 + 1.0',
  '"test"',
];
