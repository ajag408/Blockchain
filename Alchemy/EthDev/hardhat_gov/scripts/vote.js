// const tokenAddr = "0xb39Fa62bBAC53757865DA90EB9e5461a67A0aFe9";
const govAddr = "0x049CF58FF52f35194F2bBE4542426a7f165A4931";

async function main() {
  const proposalId = ethers.BigNumber.from(
    "55464478978233079024076953986344115705055625782618195002781782344501279211817"
  );

  //   const url = process.env.ALCHEMY_SEPOLIA_URL;
  //   let privateKey = process.env.SEPOLIA_PRIVATE_KEY;
  //   const provider = new ethers.providers.JsonRpcProvider(url);
  //   let owner = new ethers.Wallet(privateKey, provider);

  const governor = await hre.ethers.getContractAt("MyGovernor", govAddr);

  const state = await governor.state(proposalId);
  console.log("State of newly created proposal: ", state);

  const tx = await governor.castVote(proposalId, 1);
  const receipt = await tx.wait();
  const voteCastEvent = receipt.events.find((x) => x.event === "VoteCast");

  console.log("Who cast the vote?: ", voteCastEvent.args.voter);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
