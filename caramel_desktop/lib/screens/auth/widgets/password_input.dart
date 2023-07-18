import 'package:flutter/material.dart';

import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:multi_window/multi_window.dart';

import '../../../providers/signin_state.dart';
import '../../../utils/constants.dart';
import 'sigin_button.dart';

class PhoneInput extends StatefulWidget {
  @override
  State<PhoneInput> createState() => _PhoneInputState();
}

class _PhoneInputState extends State<PhoneInput> {
  final _formKey = GlobalKey<FormState>();

  final _passwordEditingController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    bool isPasswordVisible = false;

    return Center(
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const UserStatus(),
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: TextFormField(
                controller: _passwordEditingController,
                keyboardType: TextInputType.text,
                textInputAction: TextInputAction.done,
                obscureText: !isPasswordVisible,
                onChanged: (val) {
                  setState(() {
                    _passwordEditingController.value =
                        _passwordEditingController.value.copyWith(text: val);
                  });
                },
                textAlign: TextAlign.left,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintStyle: const TextStyle(color: Colors.white54),
                  hintText: "Password",
                  suffixIcon: SizedBox(
                    width: 20,
                    child: IconButton(
                      icon: Icon(
                        isPasswordVisible
                            ? Icons.visibility
                            : Icons.visibility_off,
                        color: Colors.white,
                      ),
                      onPressed: () {
                        setState(() {
                          isPasswordVisible = !isPasswordVisible;
                        });
                      },
                    ),
                  ),
                  icon: const Icon(
                    Icons.lock,
                    color: Colors.white,
                  ),
                ),
                autofocus: false,
                validator: (val) {
                  return val!.trim().isEmpty || val.trim().length < 6
                      ? 'Please enter a valid password (min. 6 characters)'
                      : null;
                },
              ),
            ),
            const SizedBox(height: 20),
            SignupButton(
              index: 2,
              label: 'Finish',
              formkey: _formKey,
              titleEditingController: _passwordEditingController,
              codeEditingController: null,
            )
          ],
        ),
      ),
    );
  }
}

class UserStatus extends HookConsumerWidget {
  const UserStatus({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(signupStateProvider);
    return Column(
      children: [
        !state.exists!
            ? const Text(
                'Create New Account',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              )
            : const Text(
                'Log in',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text(
            state.email!,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
      ],
    );
  }
}
