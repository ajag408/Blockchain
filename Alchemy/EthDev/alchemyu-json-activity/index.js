const axios = require("axios");

// copy-paste your URL provided in your Alchemy.com dashboard
const ALCHEMY_URL =
  "https://eth-goerli.g.alchemy.com/v2/4z1ECq9h42_2CZB-VgfZItTtJV4UxL3K";

axios
  .post(ALCHEMY_URL, {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_getTransactionCount",
    params: [
      "0x7210F409037e0071c8AeD2B8991f597b19431564", // get my wallet transaction count
      "latest", // on the latest Goerli block
    ],
  })
  .then((response) => {
    console.log(response.data.result);
  });
