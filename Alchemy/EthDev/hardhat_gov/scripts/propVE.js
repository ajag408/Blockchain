const { ethers } = require("hardhat");

const tokenAddr = "0xdA87E876B7eE28291C4E2E1b8Fed04CCA0686379";
const govAddr = "0x049CF58FF52f35194F2bBE4542426a7f165A4931";

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
    [11],
    [
      token.interface.encodeFunctionData("mint", [
        owner.address,
        ethers.utils.parseEther("25000"),
      ]),
    ],
    "Give the owner more tokens!"
  );
  const receipt = await tx.wait(2);
  const event = receipt.events.find((x) => x.event === "ProposalCreated");
  const { proposalId } = event.args;

  const state = await governor.state(proposalId);
  console.log("State of newly created proposal: ", state);

  const tx2 = await governor.castVote(proposalId, 1);
  const receipt2 = await tx2.wait(10);
  const voteCastEvent = receipt2.events.find((x) => x.event === "VoteCast");

  console.log("Who cast the vote?: ", voteCastEvent.args.voter);

  const tx3 = await governor.execute(
    [token.address],
    [11],
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
    //   gasLimit: 100000,
    // }
  );

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
