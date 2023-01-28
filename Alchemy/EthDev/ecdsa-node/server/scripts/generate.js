const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp.utils.randomPrivateKey();
console.log("private key: ", toHex(privateKey));

var publicKey = secp.getPublicKey(privateKey);
publicKey = publicKey.slice(1);
var hash = keccak256(publicKey);
console.log("public Key: ", toHex(hash.slice(hash.length - 20)));
