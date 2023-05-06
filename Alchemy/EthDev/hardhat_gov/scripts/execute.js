const { ethers } = require("hardhat");

const tokenAddr = "0xdA87E876B7eE28291C4E2E1b8Fed04CCA0686379";
const govAddr = "0x049CF58FF52f35194F2bBE4542426a7f165A4931";

async function main() {
  const url = process.env.ALCHEMY_SEPOLIA_URL;
  let privateKey = process.env.SEPOLIA_PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(url);
  let owner = new ethers.Wallet(privateKey, provider);

  // attach to the deployed gov token
  const token = await hre.ethers.getContractAt("MyToken", tokenAddr);

  const governor = await hre.ethers.getContractAt("MyGovernor", govAddr);

  const beforebalance = await token.balanceOf(owner.address);

  console.log(
    "My balance of the gov token before executing the vote: ",
    ethers.utils.formatEther(beforebalance)
  );

  const proposalId = ethers.BigNumber.from(
    "55464478978233079024076953986344115705055625782618195002781782344501279211817"
  );

  const state = await governor.state(proposalId);
  console.log("State of newly created proposal: ", state);

  //   console.log(typeof ethers.utils.parseEther("25000"));
  const tx = await governor.execute(
    [token.address],
    [9],
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

  const receipt = await tx.wait();
  const event = receipt.events.find((x) => x.event === "ProposalExecuted");
  console.log("event: ", event);
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
