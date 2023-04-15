const bucketAddr = "0xF2900bE91f81A0E9605184d20C7fE3bce600D257";
const contractName = "Bucket";
const tokenAddr = "0x6fcB24c3476E6bD396c2EE53CfD582b7769288F2";

async function main() {
  const rajaji = await hre.ethers.getContractAt("Rajaji", tokenAddr);
  //update approval mapping on rajaji
  const approval = await rajaji.approve(
    bucketAddr,
    ethers.utils.parseUnits("5", "ether")
  );
  await approval.wait();
  console.log("Approved bucket to spend 5 RJ on Ganesh's behalf");

  //   attach to the sepoliabucket
  const bucket = await hre.ethers.getContractAt(contractName, bucketAddr);

  const emit = await bucket.drop(
    tokenAddr,
    ethers.utils.parseUnits("5", "ether")
  );
  await emit.wait();
  console.log("Used bucket fxn to transfer tokens");

  //Get Ganesh's balance of Rajaji tokens

  //   const myBalance = await rajaji.balanceOf(
  //     "0x7210F409037e0071c8AeD2B8991f597b19431564"
  //   );
  //   const myRJBalance = ethers.utils.formatEther(myBalance);
  //   console.log(myRJBalance);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
