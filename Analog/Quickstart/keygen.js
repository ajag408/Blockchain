import "dotenv/config.js";
import Keyring from "@polkadot/keyring";
import { keygen } from "@analog-labs/timegraph-js";

// init polkadot keypair for node env
const keyring = new Keyring({ type: "sr25519" });
const keypair = keyring.addFromUri(process.env.PHRASE);
// pass signer and address to get keygen instance
const _keygen = new keygen({ signer: keypair.sign, address: keypair.address });
// generate API key, i.e. role is optional default will be developer
const apiKey = await _keygen.createApiKey();
// generate session key
const sessionKey = await _keygen.createSessionkey("259200000");

console.log("apiKey: ", apiKey);
console.log("sessionKey: ", sessionKey);
