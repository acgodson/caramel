// import 'package:flutter/material.dart';
// import 'package:font_awesome_flutter/font_awesome_flutter.dart';
// import 'package:street_money/models/countries.dart';
// import 'package:street_money/models/country_currency.dart';
// import 'package:street_money/utils/constants.dart';
//
// class CurrencyTags extends StatefulWidget {
//   final String? myCurrency;
//
//   const CurrencyTags({Key? key, this.myCurrency = "NGN"}) : super(key: key);
//
//   @override
//   _CurrencyTagsState createState() => _CurrencyTagsState();
// }
//
// class _CurrencyTagsState extends State<CurrencyTags> {
//   //initialize an empty list
//   List<String> _all = [];
//
//   @override
//   Widget build(BuildContext context) {
//     //Filter currencyCodes from popular countries
//     final currencyCodes = AllCountries.map((e) => CountryModel.fromJson(e))
//         .toList()
//         .where((e) =>
//     e.countryName == "United Kingdom" ||
//         e.countryName == "France" ||
//         e.countryName == "United States" ||
//         e.countryName == "China" ||
//         e.countryName == "Canada" ||
//         e.countryName == "South Africa" ||
//         e.countryName == "Ghana" ||
//         e.countryName == "Nigeria" ||
//         e.countryName == "Egypt")
//         .map((e) => e.currencyCode)
//         .toSet()
//         .toList();
//
//     //Remove my Default currency from th list
//     currencyCodes.remove(widget.myCurrency);
//
//     final countryTagList = List.generate(
//         currencyCodes.length,
//             (index) => Padding(
//             padding: const EdgeInsets.all(9.0),
//             child: Tag(
//               "${widget.myCurrency} & ${currencyCodes[index]}",
//               widget.myCurrency!,
//               currencyCodes[index]!,
//                   () {
//                 setState(() {
//                   //Add Currency to list
//                   _all.add(currencyCodes[index]!);
//                   print(_all);
//                 });
//               },
//               _all.contains(currencyCodes[index]!) ? true : false,
//                   () {
//                 //Remove currency from list
//                 if (_all.contains(currencyCodes[index]!)) {
//                   setState(() {
//                     _all.removeAt(_all.indexOf(currencyCodes[index]!));
//                     print(_all);
//                   });
//                 }
//               },
//             )));
//
//     return Scaffold(
//       body: Padding(
//         padding: const EdgeInsets.all(8.0),
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: <Widget>[
//             Expanded(
//               child: GridView.count(
//                 shrinkWrap: true,
//                 childAspectRatio: 2.5,
//                 crossAxisCount: 2,
//                 children: countryTagList,
//               ),
//             ),
//
//             ///If _all contains
//
//             Divider(),
//             //Customised add any character using which you want to seprate
//           ],
//         ),
//       ),
//     );
//   }
// }
//
// Widget Tag(
//     String tooltip,
//     String myCurrency,
//     String otherCurrency,
//     Function pressed,
//     bool tagged,
//     Function pressed2,
//     ) {
//   return SizedBox(
//     width: 120,
//     height: 30,
//     child: FloatingActionButton(
//       tooltip: tooltip,
//       shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
//       backgroundColor: tagged ? primaryColor : Colors.white,
//       onPressed: () {
//         if (tagged) {
//           pressed2();
//         } else {
//           pressed();
//         }
//       },
//       heroTag: null,
//       elevation: 3,
//       child: Row(
//           crossAxisAlignment: CrossAxisAlignment.center,
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             SizedBox(height: 40, child: Center(child: Text(myCurrency,  style: TextStyle(
//                 color: tagged ? Colors.white : kGrey
//
//             )))),
//             Container(
//               margin: EdgeInsets.symmetric(horizontal: 10),
//               height: 40,
//               child: Column(
//                 mainAxisAlignment: MainAxisAlignment.center,
//                 children: [
//                   FaIcon(
//                     FontAwesomeIcons.arrowRight,
//                     size: 12,
//                   ),
//                   FaIcon(
//                     FontAwesomeIcons.arrowLeft,
//                     size: 12,
//                   ),
//                 ],
//               ),
//             ),
//             SizedBox(height: 40, child: Center(child: Text(otherCurrency, style: TextStyle(
//                 color: tagged ? Colors.white : kGrey
//
//             ),)))
//           ]),
//     ),
//   );
// }
