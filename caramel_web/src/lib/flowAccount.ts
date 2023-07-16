import FlowPubKey from "./flowPubKey";

export default class FlowAccount {
  address: any;
  balance: any;
  publicKeys: Map<any, any>;
  constructor(opts: any = {}) {
    this.address = opts.address;
    this.balance = opts.balance;
    this.publicKeys = new Map(); // keyID to flowPubKey
  }

  addKey(id: any, hexKey: any, weight: any, sigAlg: any, hashAlg: any) {
    // what kind of validations are needed here?
    // should we check no other key has this ID before adding?
    var key: any = new FlowPubKey({
      id: id,
      publicKey: hexKey,
      weight: weight,
      sigAlg: sigAlg,
      hashAlg: hashAlg,
    });

    this.publicKeys.set(key.id, key);
    return key;
  }

  removeKey(id: any) {
    var toRemove = this.getKey(id);

    this.publicKeys.delete(id);

    return toRemove;
  }

  getKey(keyId: any) {
    return this.publicKeys.get(keyId.toString());
  }

  listKeys() {
    var valueIterator = this.publicKeys.values();
    var list = [];
    var keys = valueIterator.next();
    while (!keys.done) {
      list.push(keys.value);
      keys = valueIterator.next();
    }
    return list;
  }

  _serialize() {
    var data = {
      address: this.address,
      balance: this.balance,
      publicKeys: Object.fromEntries(this.publicKeys),
    };
    return JSON.stringify(data);
  }
}
