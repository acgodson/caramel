import 'package:flutter/material.dart';

class NewWindowPage extends StatefulWidget {
  const NewWindowPage({Key? key}) : super(key: key);

  @override
  _NewWindowPageState createState() => _NewWindowPageState();
}

class _NewWindowPageState extends State<NewWindowPage> {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return const Scaffold(
      body: Center(
        child: Text("This is a new window"),
      ),
    );
  }
}
