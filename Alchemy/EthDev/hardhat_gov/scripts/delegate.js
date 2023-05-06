const tokenAddr = "0xdA87E876B7eE28291C4E2E1b8Fed04CCA0686379";

async function main() {
  const url = process.env.ALCHEMY_SEPOLIA_URL;
  let privateKey = process.env.SEPOLIA_PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(url);
  let owner = new ethers.Wallet(privateKey, provider);

  // attach to the deployed gov token
  const token = await hre.ethers.getContractAt("MyToken", tokenAddr);

  //Balance of gov tokens before delegation
  const myBeforeBalance = await token.balanceOf(owner.address);
  const beforeBalance = ethers.utils.formatEther(myBeforeBalance);

  console.log("My balance of the gov token before delegation: ", beforeBalance);

  await token.delegate(owner.address);

  const myAfterBalance = await token.balanceOf(owner.address);
  const AfterBalance = ethers.utils.formatEther(myAfterBalance);

  console.log("My balance of the gov token AFTER delegation: ", AfterBalance);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
