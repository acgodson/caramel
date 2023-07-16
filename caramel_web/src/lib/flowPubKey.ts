export default class FlowPubKey {
  id: any;
  hashAlg: any;
  weight: any;
  sigAlg: any;
  publicKey: any;
  constructor(opts: any = {}) {
    if (opts.weight < 1 || opts.weight > 1000) {
      throw new Error("FlowPubKey weight must be an integer between 1-1000");
    }

    this.id = opts.id;
    this.publicKey = opts.publicKey;
    this.sigAlg = opts.sigAlg;
    this.hashAlg = opts.hashAlg;
    this.weight = opts.weight;
  }

  updateWeight(weight : any) {
    if (weight < 1 || weight > 1000) {
      throw new Error("FlowPubKey weight must be an integer between 1-1000");
    }
    this.weight = weight;
  }

  _serialize() {
    var data = {
      id: this.id,
      publicKey: this.publicKey,
      sigAlg: this.sigAlg,
      hashAlg: this.hashAlg,
      weight: this.weight,
    };
    return JSON.stringify(data);
  }
}
