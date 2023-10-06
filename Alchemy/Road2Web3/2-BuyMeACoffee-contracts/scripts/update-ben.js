// scripts/withdraw.js

const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.formatEther(balanceBigInt);
}

async function main() {
  // Get the contract that has been deployed to Goerli.
  const contractAddress = "0xDA38D2B87b91b766765f2BDa6A038a895bd4e50b";
  const contractABI = abi.abi;

  // Get the node connection and wallet connection.
  const provider = new hre.ethers.JsonRpcProvider(process.env.SEPOLIA_URL);

  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const signer2 = new hre.ethers.Wallet(process.env.PRIVATE_KEY2, provider);

  // Instantiate connected contract.
  const buyMeACoffee = new hre.ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  const initBen = await buyMeACoffee.getBen();
  console.log("initial owner: ", initBen);

  //   console.log(await signer.getAddress());
  const newOwner = await signer2.getAddress();
  console.log("should change to: ", newOwner);
  const updateOwner = await buyMeACoffee.updateBen(newOwner);
  await updateOwner.wait();

  const newBen = await buyMeACoffee.getBen();
  console.log("new owner: ", newBen);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
