const tokenAddr = "0x6fcB24c3476E6bD396c2EE53CfD582b7769288F2";
const contractName = "Rajaji";

async function main() {
  // attach to the game
  const rajaji = await hre.ethers.getContractAt(contractName, tokenAddr);

  //Ganesh's initial balance of RJ tokens
  const myBalance = await rajaji.balanceOf(
    "0x7210F409037e0071c8AeD2B8991f597b19431564"
  );
  const myRJBalance = ethers.utils.formatEther(myBalance);

  //airdrop 5 to hardhat ben
  if (myRJBalance > 5) {
    const airdrop = await rajaji.transfer(
      "0x3c2Da59c36367Fd3D0f08dc4f7085f776E42f8E4",
      ethers.utils.parseUnits("5", "ether")
    );
    await airdrop.wait();
    const myNewBalance = await rajaji.balanceOf(
      "0x7210F409037e0071c8AeD2B8991f597b19431564"
    );
    console.log(
      "My Balance after airdrop: ",
      ethers.utils.formatEther(myNewBalance)
    );

    const homiesBalance = await rajaji.balanceOf(
      "0x3c2Da59c36367Fd3D0f08dc4f7085f776E42f8E4"
    );
    console.log(
      "Homies Balance after airdrop: ",
      ethers.utils.formatEther(homiesBalance)
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
