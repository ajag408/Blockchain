const tokenAddr = "0xdA87E876B7eE28291C4E2E1b8Fed04CCA0686379";
const govAddr = "0x049CF58FF52f35194F2bBE4542426a7f165A4931";

async function main() {
  const url = process.env.ALCHEMY_SEPOLIA_URL;
  let privateKey = process.env.SEPOLIA_PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(url);
  let owner = new ethers.Wallet(privateKey, provider);

  // attach to the deployed contracts
  const token = await hre.ethers.getContractAt("MyToken", tokenAddr);

  const governor = await hre.ethers.getContractAt("MyGovernor", govAddr);

  const beforebalance = await token.balanceOf(owner.address);

  console.log(
    "My balance of the gov token before executing the vote: ",
    ethers.utils.formatEther(beforebalance)
  );

  const proposalId = ethers.BigNumber.from(
    "17565764570626194834282076841594552290290221574083708542123816836522535460908"
  );

  //state should be 4 (succeeded)
  const state = await governor.state(proposalId);
  console.log("State of newly created proposal: ", state);

  try {
    const tx = await governor.execute(
      [token.address],
      [18],
      [
        token.interface.encodeFunctionData("mint", [
          owner.address,
          ethers.utils.parseEther("25000"),
        ]),
      ],
      ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("Give the owner more tokens!")
      )
      // {
      //   gasPrice: 99999999,
      //   gasLimit: 99999999,
      // }
    );

    const receipt = await tx.wait();
    const event = receipt.events.find((x) => x.event === "ProposalExecuted");
    console.log("event: ", event);
  } catch (e) {
    console.log("ERROR: ", e);
  }

  const afterbalance = await token.balanceOf(owner.address);

  console.log(
    "My balance of the gov token AFTER executing the vote: ",
    ethers.utils.formatEther(afterbalance)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
