require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    },
  },
};

//gov add: 0x049CF58FF52f35194F2bBE4542426a7f165A4931
//toke add: 0xb39Fa62bBAC53757865DA90EB9e5461a67A0aFe9
