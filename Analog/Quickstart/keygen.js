import { keygen } from "@analog-labs/timegraph-js/keygen/web";
import { web3FromAddress } from "@polkadot/extension-dapp";
// init signer based on polkadot/extension-dapp
const { signer } = await web3FromAddress(
  "5FHJQpmxMhopuWNCEQrHQJvzAe66nQkfT5zFWkaKYZHhvuRP"
);
// pass signer and address to get keygen instance
const _keygen = new keygen({
  signer: signer.signRaw,
  address: "5FHJQpmxMhopuWNCEQrHQJvzAe66nQkfT5zFWkaKYZHhvuRP",
});
// generate api key i.e role is optional default will be developer
const apikey = await _keygen.createApiKey();
// generate the session key
const sessionKey = await _keygen.createSessionkey();

console.log("apiKey: ", apiKey);
console.log("sessionKey: ", sessionKey);
