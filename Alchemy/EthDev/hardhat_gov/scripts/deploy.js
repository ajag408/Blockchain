const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const url = process.env.ALCHEMY_SEPOLIA_URL;
  let privateKey = process.env.SEPOLIA_PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(url);
  let owner = new ethers.Wallet(privateKey, provider);

  const transactionCount = await owner.getTransactionCount();

  // gets the address of the token before it is deployed
  const futureAddress = ethers.utils.getContractAddress({
    from: owner.address,
    nonce: transactionCount + 1,
  });

  // const MyGovernor = await ethers.getContractFactory("MyGovernor");
  // const governor = await MyGovernor.deploy(futureAddress);

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(
    "0x049CF58FF52f35194F2bBE4542426a7f165A4931"
  );

  console.log(
    // `Governor deployed to ${governor.address}`,
    `Token deployed to ${token.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
