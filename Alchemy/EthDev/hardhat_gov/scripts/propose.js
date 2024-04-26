const tokenAddr = "0xdA87E876B7eE28291C4E2E1b8Fed04CCA0686379";
const govAddr = "0x049CF58FF52f35194F2bBE4542426a7f165A4931";

async function main() {
  const url = process.env.ALCHEMY_SEPOLIA_URL;
  let privateKey = process.env.SEPOLIA_PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(url);
  let owner = new ethers.Wallet(privateKey, provider);

  // attach to the deployed gov token
  const token = await hre.ethers.getContractAt("MyToken", tokenAddr);

  //attach to governance contract
  const governor = await hre.ethers.getContractAt("MyGovernor", govAddr);

  //propose to mint extra 25K tokens to owner
  //INCREMENT THE VALUE IF TRYING AGAIN
  //(Have tried and failed 17 proposals)
  const tx = await governor.propose(
    [token.address],
    [18],
    [
      token.interface.encodeFunctionData("mint", [
        owner.address,
        ethers.utils.parseEther("25000"),
      ]),
    ],
    "Give the owner more tokens!"
    // {
    //   gasPrice: 10000000,
    //   gasLimit: 10000000,
    // }
  );
  const receipt = await tx.wait();
  const event = receipt.events.find((x) => x.event === "ProposalCreated");
  const { proposalId } = event.args;

  console.log("Proposal ID: ", proposalId);

  //state should be 0
  const state = await governor.state(proposalId);
  console.log("State of newly created proposal: ", state);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
