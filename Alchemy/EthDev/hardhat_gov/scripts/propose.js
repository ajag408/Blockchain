const tokenAddr = "0xdA87E876B7eE28291C4E2E1b8Fed04CCA0686379";
const govAddr = "0x049CF58FF52f35194F2bBE4542426a7f165A4931";
//proposal counter: next one at [7]
async function main() {
  // attach to the deployed gov token
  const token = await hre.ethers.getContractAt("MyToken", tokenAddr);

  const governor = await hre.ethers.getContractAt("MyGovernor", govAddr);

  const url = process.env.ALCHEMY_SEPOLIA_URL;
  let privateKey = process.env.SEPOLIA_PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(url);
  let owner = new ethers.Wallet(privateKey, provider);

  //propose to mint extra 25K tokens to owner
  const tx = await governor.propose(
    [token.address],
    [8],
    [
      token.interface.encodeFunctionData("mint", [
        owner.address,
        ethers.utils.parseEther("25000"),
      ]),
    ],
    "Give the owner more tokens!"
  );
  const receipt = await tx.wait();
  const event = receipt.events.find((x) => x.event === "ProposalCreated");
  const { proposalId } = event.args;

  console.log("Proposal ID: ", proposalId);

  //   const url = process.env.ALCHEMY_SEPOLIA_URL;

  //   const provider = new ethers.providers.JsonRpcProvider(url);

  //   // wait for the block voting delay
  //   await hre.network.provider.request("evm_mine");

  const state = await governor.state(proposalId);
  console.log("State of newly created proposal: ", state);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
