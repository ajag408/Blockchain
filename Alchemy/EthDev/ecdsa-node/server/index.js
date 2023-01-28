const express = require("express");
const app = express();
const cors = require("cors");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
require("dotenv").config();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  e03e25c39d82a0ab6393a2df1003e33c2d1d25bd: 100,
  "687931e0c9c801deafe64d364b25b9491f017a48": 50,
  fd5cc260c0bee83b5cd147172bbdd5948b0fb638: 75,
};

var nonce;

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  return keccak256(bytes);
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  let { sender, sig, recoveryBit, amountUnparsed, amount, recipient, nonceIn } =
    req.body;

  if (nonceIn == nonce) {
    nonce = toHex(secp.utils.randomPrivateKey());
  } else {
    res.status(400).send({ message: "Invalid nonce" });
    return;
  }
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
    return;
  } else {
    const hash = hashMessage(amountUnparsed);
    var sigArr = [];
    for (const [key, value] of Object.entries(sig)) {
      sigArr.push(value);
    }
    sig = Uint8Array.from(sigArr);
    let recovered = await secp.recoverPublicKey(hash, sig, recoveryBit);
    recovered = recovered.slice(1);
    recovered = keccak256(recovered);
    recovered = recovered.slice(recovered.length - 20);
    recovered = toHex(recovered);

    if (recovered == sender) {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    } else {
      res
        .status(400)
        .send({ message: "Not a valid signature for this wallet" });
      return;
    }
  }
});

app.post("/sign", async (req, res) => {
  const { sender, amount } = req.body;
  const hash = hashMessage(amount);
  let PRIVATE_KEY;
  if (sender == "e03e25c39d82a0ab6393a2df1003e33c2d1d25bd") {
    PRIVATE_KEY = process.env.e03e25c39d82a0ab6393a2df1003e33c2d1d25bd;
  } else if (sender == "fd5cc260c0bee83b5cd147172bbdd5948b0fb638") {
    PRIVATE_KEY = process.env.fd5cc260c0bee83b5cd147172bbdd5948b0fb638;
  } else {
    res.status(400).send({ message: "Enter a public wallet that you own!" });
    return;
  }
  const [sig, recoveryBit] = await secp.sign(hash, PRIVATE_KEY, {
    recovered: true,
  });
  if (nonce == undefined) {
    nonce = toHex(secp.utils.randomPrivateKey());
  }
  res.send({ sig: sig, recoveryBit: recoveryBit, nonce: nonce });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
