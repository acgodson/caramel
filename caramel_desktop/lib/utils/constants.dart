import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

// Colors
const primaryColor = Color(0xFF2697FF);
const Color lightBackground = Colors.white;
const Color darkBackground = Color(0xFF212332);
const Color lightText = Color(0xFFB9C1D9);
const secondaryColor = Color(0xFF2A2D3E);

const Color kWhite = Color(0xFFFFFFFF);
const Color kGreen = Color(0xFF40BF6A);
const Color kDarkGrey = Color(0xFF131316);

const Color kBlack = Color(0xFF363536);
const Color kPurple = Color(0xFF8B30A0);
const Color kYellow = Color(0xFFFEC437);
const Color kRed = Color(0xFFFF2511);
const Color kBlue = Color(0xFF414457);
const Color kGrey = Color(0xFFB8B2CB);
const Color kLightGrey = Color(0xFFE6E6E6);
const Color kLight = Color(0xFFEFEFEF);

// Padding
const double kPaddingS = 8.0;
const double kPaddingM = 16.0;
const double kPaddingL = 32.0;

// Spacing
const double kSpaceS = 8.0;
const double kSpaceM = 16.0;

class Constants {
  Constants._();

  static const double padding = 20;
  static const double avatarRadius = 45;
}

// Margin
const double kMargin = 20;

// Assets
const String cardTopRight = 'assets/images/top_right.png';
const String cardBottomLeft = 'assets/images/bottom_left.png';
const String chartIncrease = 'assets/images/increase.png';
const String chartDecrease = 'assets/images/decrease.png';
const String naira = 'assets/images/naira.png';
const String pounds = 'assets/images/pounds.png';
const String euro = 'assets/images/euro.png';
const String dollars = 'assets/images/dollars.png';
const String logoBlack = 'assets/images/logo_icon_black.png';
const String logoWhite = 'assets/images/logo_icon_white.png';
const String swap = 'assets/images/swap.png';
const String send_home = 'assets/images/send_home.png';
const String send_abroad = 'assets/images/send_abroad.png';

const String signupDialog = 'assets/images/signup_dialog.png';
const String splash_logo = 'assets/images/splash_logo.png';
// Shadow
List<BoxShadow> customShadow = [
  BoxShadow(
    color: Colors.white.withOpacity(0.5),
    spreadRadius: -5,
    offset: Offset(-5, 0),
    blurRadius: 30,
  ),
  BoxShadow(
    color: Colors.grey[900]!.withOpacity(.2),
    spreadRadius: 2,
    offset: Offset(7, 7),
    blurRadius: 20,
  ),
];

List<BoxShadow> customShadow2 = [
  BoxShadow(
    color: Color.fromARGB(70, 201, 201, 201),
    blurRadius: 3.0, // soften the shadow
    spreadRadius: 1.0, //extend the shadow
    offset: Offset(
      -1, // Move to right horizontally
      0, // Move to bottom Vertically
    ),
  ),
  BoxShadow(
    color: Color.fromARGB(30, 201, 201, 201),
    blurRadius: 20.0, // soften the shadow
    spreadRadius: 2.0, //extend the shadow
    offset: Offset(
      0.0, // Move to right horizontally
      4.0, // Move to bottom Vertically
    ),
  ),
];

List<BoxShadow> customShadow3 = [
  BoxShadow(
    color: Color.fromRGBO(150, 170, 180, 0.5),
    spreadRadius: -10.0, //extend the shadow
    blurRadius: 30.0, // soften the shadow
    offset: Offset(
      0.0, // Move to right horizontally
      7.0, // Move to bottom Vertically
    ),
  ),
];

final appTheme = ThemeData(
  primarySwatch: Colors.purple,
);

final kLoadingSnackBar = SnackBar(
    content: Row(
  children: [
    SizedBox(
        height: 30,
        width: 30,
        child: Center(child: CircularProgressIndicator())),
    Padding(
      padding: const EdgeInsets.only(left: 8.0),
      child: Text("Updating"),
    )
  ],
));

List<String> streetText = [
  "The act of",
  "Social Trading",
  "StreetMoney is a peer-to-peer stage designed to enable free direct currency exchange and borderless transfers",
  "Get Started",
  "P2P marketplace",
  "Buy/Sell",
  "and get paid into",
  "any account.",
  "How does it work?",
  "Well, it's as easy as",
  "signup, engage, receive.",
  "Stay in touch",
  "Subscribe to our email list to receive updates on platform features and general market tips",
  "Email address",
  "Subscribe",
];

List<Map<String, dynamic>> languages = [
  {
    "name": "English",
    "value": "en",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/gb.svg"))
  },
  {
    "name": "Swedish",
    "value": "sv",
    "icon": SizedBox(
      width: 16,
      height: 16,
      child: SvgPicture.asset("assets/flags/sv.svg"),
    )
  },
  {
    "name": "Spanish",
    "value": "es",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/es.svg"))
  },
  {
    "name": "German",
    "value": "de",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/de.svg"))
  },
  {
    "name": "French",
    "value": "fr",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/fr.svg"))
  },
  {
    "name": "Russian",
    "value": "ru",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/ru.svg"))
  },
  {
    "name": "Afrikaans",
    "value": "af",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/af.svg"))
  },
  {
    "name": "Irish",
    "value": "ga",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/ga.svg"))
  },
  // {
  //   "name": "Albanian",
  //   "value": "sq",
  //   "icon": SizedBox(width: 16, child: SvgPicture.asset("assets/flags/sq.svg"))
  // },
  {
    "name": "Italian",
    "value": "it",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/it.svg"))
  },
  {
    "name": "Arabic",
    "value": "ar",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/ar.svg"))
  },
  // {
  //   "name": "Japanese",
  //   "value": "ja",
  //   "icon": SizedBox(width: 16, height: 16, child: SvgPicture.asset("assets/flags/ja.svg"))
  // },
  {
    "name": "Azerbaijani",
    "value": "az",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/az.svg"))
  },
  {
    "name": "Kannada",
    "value": "kn",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/kn.svg"))
  },
  {
    "name": "Basque",
    "value": "eu",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/eu.svg"))
  },
  // {
  //   "name": "Korean",
  //   "value": "ko",
  //   "icon": SizedBox(width: 16, height: 16, child: SvgPicture.asset("assets/flags/ko.svg"))
  // },
  {
    "name": "Bengali",
    "value": "bn",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/bn.svg"))
  },
  {
    "name": "Latin",
    "value": "la",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/la.svg"))
  },
  {
    "name": "Belarusian",
    "value": "be",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/be.svg"))
  },
  {
    "name": "Latvian",
    "value": "lv",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/lv.svg"))
  },
  {
    "name": "Bulgarian",
    "value": "bg",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/bg.svg"))
  },
  {
    "name": "Lithuanian",
    "value": "lt",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/lt.svg"))
  },
  {
    "name": "Chinese Simplified",
    "value": "zh-CN",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/cn.svg"))
  },
  {
    "name": "Macedonian",
    "value": "mk",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/mk.svg"))
  },
  {
    "name": "Malay",
    "value": "ms",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/ms.svg"))
  },
  // {
  //   "name": "Maltese",
  //   "value": "mt",
  //   "icon": SizedBox(width: 16, height: 16, child: SvgPicture.asset("assets/flags/mt.svg"))
  // },
  {
    "name": "Croatian",
    "value": "hr",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/hr.svg"))
  },
  {
    "name": "Norwegian",
    "value": "no",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/no.svg"))
  },
  {
    "name": "Czech",
    "value": "cs",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/cz.svg"))
  },
  // {
  //   "name": "Danish",
  //   "value": "da",
  //   "icon": SizedBox(width: 16, height: 16, child: SvgPicture.asset("assets/flags/da.svg"))
  // },
  {
    "name": "Polish",
    "value": "pl",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/gb.svg"))
  },
  {
    "name": "Portuguese",
    "value": "pt",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/pl.svg"))
  },
  {
    "name": "Romanian",
    "value": "ro",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/ro.svg"))
  },
  {
    "name": "Estonian",
    "value": "et",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/et.svg"))
  },
  {
    "name": "Filipino",
    "value": "tl",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/tl.svg"))
  },
  {
    "name": "Finnish",
    "value": "fi",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/fi.svg"))
  },
  // {
  //   "name": "Ukrainian",
  //   "value": "uk",
  //   "icon": SizedBox(width: 16, height: 16, child: SvgPicture.asset("assets/flags/uk.svg"))
  // },
  {
    "name": "Indonesian",
    "value": "id",
    "icon": SizedBox(
        width: 16, height: 16, child: SvgPicture.asset("assets/flags/id.svg"))
  },
  // {
  //   "name": "Hindi",
  //   "value": "hi",
  //   "icon": SizedBox(width: 16, height: 16, child: SvgPicture.asset("assets/flags/hi.svg"))
  // },
];

List<Map<String, dynamic>> GDPBanks = [
  // {
  //   "name": "Bank of Scotland",
  //   "value": "Bank of Scotland",
  //   "icon": SizedBox(),
  // },

  {
    "name": "Barclays",
    "value": "Barclays",
    "icon": SizedBox(),
  },
  {
    "name": "First Direct",
    "value": "First Direct",
    "icon": SizedBox(),
  },
  {
    "name": "HSBC",
    "value": "HSBC",
    "icon": SizedBox(),
  },
  {
    "name": "Halifax",
    "value": "Halifax",
    "icon": SizedBox(),
  },
  {
    "name": "Lloyds Bank",
    "value": "Lloyds Bank",
    "icon": SizedBox(),
  },

  {
    "name": "NatWest",
    "value": "NatWest",
    "icon": SizedBox(),
  },
  {
    "name": "NationWide",
    "value": "NationWide",
    "icon": SizedBox(),
  },
  {
    "name": "RBS",
    "value": "RBS",
    "icon": SizedBox(),
  },
  {
    "name": "Revolt",
    "value": "Revolt",
    "icon": SizedBox(),
  },
  {
    "name": "Santander",
    "value": "Santander",
    "icon": SizedBox(),
  },
  {
    "name": "TSB",
    "value": "TSB",
    "icon": SizedBox(),
  },
  {
    "name": "Tesco Bank",
    "value": "Tesco Bank",
    "icon": SizedBox(),
  },
  {
    "name": "Ulster Bank",
    "value": "Ulster Bank",
    "icon": SizedBox(),
  }
];

List<Map<String, dynamic>> NGNBanks = [
  {
    "name": "Access",
    "value": "Access",
    "icon": SizedBox(),
  },
  {
    "name": "Fidelity",
    "value": "Fidelity",
    "icon": SizedBox(),
  },
  {
    "name": "FCMB",
    "value": "FCMB",
    "icon": SizedBox(),
  },
  {
    "name": "GTB",
    "value": "GTB",
    "icon": SizedBox(),
  },
  {
    "name": "Union Bank",
    "value": "Union Bank",
    "icon": SizedBox(),
  },
  {
    "name": "UBA",
    "value": "UBA",
    "icon": SizedBox(),
  },
  {
    "name": "Zenith",
    "value": "Zenith",
    "icon": SizedBox(),
  }
];
