# Caramel-js SDK

[![npm version](https://img.shields.io/npm/v/caramel-js.svg)](https://www.npmjs.com/package/caramel-js)
[![license](https://img.shields.io/github/license/qcgodson/caramel-js)](https://github.com/your-github-username/caramel-js/blob/main/LICENSE)

Public cryptography for encryting NFT metadata on flow blockchain with public key and decrypting with private key

## Installation

```bash
npm install caramel-js

```
## Usage

```bash
// Import the module
import { encryptMsg, decryptMsg } from 'caramel-js/utils';

// Use the functions
const encryptedData = encryptMsg(message, publicKey);
const decryptedData = decryptMsg(encryptedData, privateKey);

```
