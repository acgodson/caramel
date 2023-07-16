import 'package:cloud_firestore/cloud_firestore.dart';

class UserData {
  String? id;
  String? first;
  String? last;
  String? user;
  String? phone;
  String? email;
  String? country;
  int? kyc;
  String? date;
  List<String>? tags;
  List<Socials>? socials;
  String? createdAt;

  UserData(
      {this.id,
      this.first,
      this.last,
      this.user,
      this.phone,
      this.email,
      this.country,
      this.kyc,
      this.date,
      this.tags,
      this.socials,
      this.createdAt});

  UserData.fromDocumentSnapshot(DocumentSnapshot<Map<String, dynamic>> doc) {
    id = doc.id;
    first = doc.data()!['first'];
    last = doc.data()!['last'];
    user = doc.data()!['user'];
    phone = doc.data()!['phone'];
    email = doc.data()!['email'];
    country = doc.data()!['country'];
    kyc = doc.data()!['kyc'];
    date = doc.data()!['date'];
    tags = doc.data()!['tags'].cast<String>();
    createdAt = doc.data()!['createdAt'];
    if (doc.data()!['socials'] != null) {
      socials = <Socials>[];
      doc.data()!['socials'].forEach((v) {
        socials!.add(new Socials.fromDocumentSnapshot(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['first'] = this.first;
    data['last'] = this.last;
    data['user'] = this.user;
    data['phone'] = this.phone;
    data['email'] = this.email;
    data['country'] = this.country;
    data['kyc'] = this.kyc.toString();
    data['date'] = this.date;
    data['tags'] = this.tags;
    data['socials'] = this.socials;
    data['createdAt'] = this.createdAt;
    return data;
  }
}

class Socials {
  String? type;
  String? value;

  Socials({this.type, this.value});

  Socials.fromDocumentSnapshot(DocumentSnapshot<Map<String, dynamic>> doc) {
    type = doc.data()!['type'];
    value = doc.data()!['value'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['type'] = this.type;
    data['value'] = this.value;
    return data;
  }
}
