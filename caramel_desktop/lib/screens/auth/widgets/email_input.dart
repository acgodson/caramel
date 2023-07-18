import 'package:flutter/material.dart';

import 'sigin_button.dart';

class EmailInput extends StatefulWidget {
  @override
  State<EmailInput> createState() => _EmailInputState();
}

class _EmailInputState extends State<EmailInput> {
  final _formKey = GlobalKey<FormState>();

  final _titleEditingController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: TextFormField(
                controller: _titleEditingController,
                keyboardType: TextInputType.phone,
                textInputAction: TextInputAction.next,
                onChanged: (val) {
                  setState(() {
                    _titleEditingController.value =
                        _titleEditingController.value.copyWith(text: val);
                  });
                },
                textAlign: TextAlign.left,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  hintStyle: TextStyle(color: Colors.white54),
                  hintText: "Email Address",
                ),
                autofocus: false,
                validator: (val) {
                  return val!.trim().isEmpty || val.trim().length < 4
                      ? 'Please enter a valid email address'
                      : null;
                },
              ),
            ),
            const SizedBox(height: 20),
            SignupButton(
              index: 1,
              label: 'Finish',
              formkey: _formKey,
              titleEditingController: _titleEditingController,
            )
          ],
        ),
      ),
    );
  }
}
