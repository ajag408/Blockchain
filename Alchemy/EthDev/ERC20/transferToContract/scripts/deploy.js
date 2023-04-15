const ethers = require("ethers");
require("dotenv").config();

async function main() {
  const url = process.env.ALCHEMY_SEPOLIA_URL;

  let artifacts = await hre.artifacts.readArtifact("Bucket");

  const provider = new ethers.providers.JsonRpcProvider(url);

  let privateKey = process.env.SEPOLIA_PRIVATE_KEY;

  let wallet = new ethers.Wallet(privateKey, provider);

  // Create an instance of a Faucet Factory
  let factory = new ethers.ContractFactory(
    artifacts.abi,
    artifacts.bytecode,
    wallet
  );

  let bucket = await factory.deploy();

  console.log("Sepolia bucket address:", bucket.address);

  await bucket.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
