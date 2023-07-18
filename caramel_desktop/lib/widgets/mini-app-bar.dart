import 'package:flutter/material.dart';

class MiniAppBar extends StatefulWidget {
  const MiniAppBar({Key? key}) : super(key: key);

  @override
  State<MiniAppBar> createState() => _MiniAppBarState();
}

class _MiniAppBarState extends State<MiniAppBar> {
  String selectedNetwork = 'Flow Testnet';

  @override
  Widget build(BuildContext context) {
    return AppBar(
      automaticallyImplyLeading: false,
      title: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            DropdownButton<String>(
              elevation: 0,
              borderRadius: BorderRadius.circular(15),
              dropdownColor: Colors.white,
              value: selectedNetwork,
              style: const TextStyle(fontSize: 12, color: Colors.black),
              onChanged: (newValue) {
                setState(() {
                  selectedNetwork = newValue!;
                });
              },
              items: <String>['Flow Testnet'].map((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Row(
                    children: [
                      Image.asset(
                        'assets/images/flow_logo.png',
                        width: 18,
                        height: 18,
                      ),
                      Padding(
                        padding: const EdgeInsets.only(left: 3.0),
                        child: Text(
                          value,
                          style: const TextStyle(fontWeight: FontWeight.w400),
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(6),
                color: Colors.black,
              ),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              child: RichText(
                text: const TextSpan(
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    shadows: [
                      Shadow(
                        color: Colors.brown,
                        blurRadius: 1,
                        offset: Offset(0, 2),
                      ),
                    ],
                  ),
                  children: [
                    TextSpan(
                      text: 'C',
                      style: TextStyle(color: Colors.amber),
                    ),
                    TextSpan(text: 'aramel'),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      backgroundColor: Colors.white,
      elevation: 0,
    );
  }
}
