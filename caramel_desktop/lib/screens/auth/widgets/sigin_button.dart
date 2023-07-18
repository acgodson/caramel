import 'dart:convert';
import 'package:caramel_desktop/services/auth_service.dart';
import 'package:desktop_webview_window/desktop_webview_window.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';

import '../../../providers/signin_state.dart';
import '../../../utils/constants.dart';

class SignupButton extends HookConsumerWidget {
  final int? index;
  final String? label;

  final GlobalKey<FormState>? formkey;
  final DateTime? date;
  final TextEditingController? titleEditingController;
  final TextEditingController? codeEditingController;

  const SignupButton(
      {Key? key,
      this.index,
      this.label,
      this.formkey,
      this.date,
      this.titleEditingController,
      this.codeEditingController})
      : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(signupStateProvider);

    bool _loading = false;
    void switcher() {
      switch (index) {
        case 0:
          state.tab = SignUpScreenTab.email;
          break;
        case 1:
          state.email = titleEditingController!.text.trim();
          state.tab = SignUpScreenTab.password;
          break;
        case 2:
          state.password = titleEditingController!.text.trim();
          break;
        default:
          print('default');
          state.tab = SignUpScreenTab.welcome;
      }
    }

    Future<bool> checkUser(email) async {
      print("started");
      var headers = {
        'Accept': '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        'Content-Type': 'application/json',
      };

      var url = Uri.parse('https://caramel-pi.vercel.app/api/check-user');

      var body = {
        "email": email,
      };

      try {
        var response =
            await http.post(url, headers: headers, body: json.encode(body));

        if (response.statusCode >= 200 && response.statusCode < 300) {
          var responseBody = json.decode(response.body);
          var keyExists = responseBody['keyExists'] ?? false;
          print(keyExists);
          return keyExists;
        } else {
          // Handle non-2xx response status code
          return false;
        }
      } catch (error) {
        print(error.toString());
        return false;
      }
    }

    return Builder(
        builder: (ctx) => Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 0.0),
                child: ElevatedButton.icon(
                  style:
                      ElevatedButton.styleFrom(backgroundColor: Colors.amber),
                  onPressed: () async {
                    if (index == 0) {
                      switcher();
                    } else {
                      if (formkey!.currentState!.validate()) {
                        if (index == 1) {
                          var newUser = await checkUser(
                              titleEditingController?.text.trim());
                          if (newUser) {
                            //retrieve exiting account
                            state.exists = true;
                            switcher();
                          } else {
                            //create new acc
                            state.exists = false;
                            switcher();
                          }
                        } else {
                          switcher();
                          if (state.exists == false) {
                            var userCred = await AuthService()
                                .signUpUser(state.email!, state.password!);
                            var url =
                                "https://caramel-pi.vercel.app/signin?_user=";
                            var url2 = "http://localhost:3000/signin?_user=";

                            if (userCred != null) {
                              final Uri _url = Uri.parse(url +
                                  userCred.user!.toString() +
                                  "&password=" +
                                  state.password.toString());

                              //launch browser
                              // if (!await launchUrl(_url)) {
                              //   throw Exception('Could not launch $_url');
                              // }

                              // launch in-app
                              _onTap(_url.toString());
                            }
                          }
                        }
                      }
                    }
                  },
                  icon: FaIcon(
                    index == 0
                        ? FontAwesomeIcons.envelope
                        : index == 1
                            ? null
                            : FontAwesomeIcons.key,
                    color: kBlack,
                  ),
                  label: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: index == 0
                        ? const Text(
                            "Sign in With Email",
                            style: TextStyle(color: kBlack),
                          )
                        : const Text(
                            "Continue",
                            style: TextStyle(color: kBlack),
                          ),
                  ),
                ),
              ),
            ));
  }

  void _onTap(url) async {
    final webview = await WebviewWindow.create(
        // configuration: CreateConfiguration(
        // userDataFolderWindows: await _getWebViewPath(),
        // titleBarTopPadding: Platform.isMacOS ? 20 : 0,
        // ),
        );
    webview
      ..setBrightness(Brightness.dark)
      ..setApplicationNameForUserAgent(" caramel_desktop/1.0.0")
      ..launch(url)
      ..addOnUrlRequestCallback((url) {
        debugPrint('url: $url');
        final uri = Uri.parse(url);
        if (uri.path == '/login-success') {
          debugPrint('login success. token: ${uri.queryParameters}');

          // webview.close();
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
