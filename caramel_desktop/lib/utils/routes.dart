abstract class OCDRoutes {
  static const home = '/home';
  static const auth = '/signin';
  static const view = '/view';
  static const wait = '/wait';

  static render(String url, {Map<String, dynamic>? params}) {
    return Uri(path: url, queryParameters: params ?? {}).toString();
  }
}
