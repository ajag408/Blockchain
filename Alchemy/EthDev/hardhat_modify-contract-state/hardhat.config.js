require("@nomiclabs/hardhat-ethers");

require("dotenv").config();

module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: process.env.ALCH_GOERLI_URL,
      accounts: [process.env.GANESH],
    },
  },
};
