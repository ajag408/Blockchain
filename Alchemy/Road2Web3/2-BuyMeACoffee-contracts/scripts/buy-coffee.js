const hre = require("hardhat");

// Returns the Ether balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    const size = memo.size;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) bought a ${size} coffee and said: "${message}"`
    );
  }
}

async function main() {
  // Get the example accounts we'll be working with.
  const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();

  // We get the contract to deploy.
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();

  // Deploy the contract.
  // console.log("buyMeACoffee: ", buyMeACoffee);
  await buyMeACoffee.waitForDeployment();
  console.log("BuyMeACoffee deployed to:", buyMeACoffee.getAddress());

  // Check balances before the coffee purchase.
  const addresses = [
    owner.getAddress(),
    tipper.getAddress(),
    buyMeACoffee.getAddress(),
  ];
  console.log("== start ==");
  await printBalances(addresses);

  // Buy the owner a few coffees.
  const tip = { value: hre.ethers.parseEther("1") };
  await buyMeACoffee
    .connect(tipper)
    .buyCoffee("Carolina", "You're the best!", tip);
  await buyMeACoffee
    .connect(tipper2)
    .buyCoffee("Vitto", "Amazing teacher", tip);
  await buyMeACoffee
    .connect(tipper3)
    .buyLargeCoffee("Kay", "I love my Proof of Knowledge", tip);

  // Check balances after the coffee purchase.
  console.log("== bought coffee ==");
  await printBalances(addresses);

  // Withdraw.
  await buyMeACoffee.connect(owner).withdrawTips();

  // Check balances after withdrawal.
  console.log("== withdrawTips ==");
  await printBalances(addresses);

  // Check out the memos.
  console.log("== memos ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);

  //test update owner

  //   // Buy the owner a few coffees.
  //   const tip2 = { value: hre.ethers.parseEther("1") };
  //   await buyMeACoffee.connect(tipper).buyCoffee("JAK", "GEEKED", tip2);
  //   await buyMeACoffee.connect(tipper2).buyCoffee("JAK", "GEEKING", tip2);
  //   await buyMeACoffee.connect(tipper3).buyCoffee("JAK", "TWEAKIN", tip2);

  //   // Check balances after the coffee purchase.
  //   console.log("== bought coffee ==");
  //   await printBalances(addresses);

  //   // Withdraw.
  //   await buyMeACoffee.connect(owner).updateBen(tipper);
  //   await buyMeACoffee.connect(owner).withdrawTips();
  //   await buyMeACoffee.connect(tipper).withdrawTips();

  //   // Check balances after withdrawal.
  //   console.log("== withdrawTips ==");
  //   await printBalances(addresses);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
