// const tokenAddr = "0xb39Fa62bBAC53757865DA90EB9e5461a67A0aFe9";
const govAddr = "0x049CF58FF52f35194F2bBE4542426a7f165A4931";

async function main() {
  //Proposal ID copied and hard-coded from previous step (propose.js)
  const proposalId = ethers.BigNumber.from(
    "17565764570626194834282076841594552290290221574083708542123816836522535460908"
  );

  const governor = await hre.ethers.getContractAt("MyGovernor", govAddr);

  //state needs to be 1 (Pending)
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
