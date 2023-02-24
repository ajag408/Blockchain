const ethers = require("ethers");
require("dotenv").config();

async function main() {
  const url = process.env.ALCH_GOERLI_URL;

  let artifacts = await hre.artifacts.readArtifact("ModifyVariable");

  const provider = new ethers.providers.JsonRpcProvider(url);

  let privateKey = process.env.GANESH;

  let wallet = new ethers.Wallet(privateKey, provider);

  // Create an instance of a Faucet Factory
  let factory = new ethers.ContractFactory(
    artifacts.abi,
    artifacts.bytecode,
    wallet
  );

  let contract = await factory.deploy(10, "");

  console.log("Contract address:", contract.address);

  await contract.deployed();

  //   // getter for state variable x
  const oldX = await contract.x();
  console.log("Old X: ", oldX.toNumber());

  const setterResponse = await contract.modifyToLeet();
  //need to wait for transaction to be mined before state change is updated
  //can use 1 below for faster run
  await setterResponse.wait(6);

  // getter for state variable x
  const newX = await contract.x();
  console.log("New X: ", newX.toNumber());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
