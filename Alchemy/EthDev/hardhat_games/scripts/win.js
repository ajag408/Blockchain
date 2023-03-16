// add the game address here and update the contract name if necessary
const gameAddr = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
const contractName = "Game5";

async function main() {
  // attach to the game
  const game = await hre.ethers.getContractAt(contractName, gameAddr);

  // do whatever you need to do to win the game here:

  //Game2
  // const setX = await game.setX(3);
  // await setX.wait();

  // const setY = await game.setY(47);
  // await setY.wait();

  // const tx = await game.win();

  //Game3
  // const tx = await game.win(45);

  //Game4
  // const tx = await game.win(56);

  //Game5
  const allowance = await game.giveMeAllowance(20000);
  await allowance.wait();

  const mintMe = await game.mint(15000);
  await mintMe.wait();

  const tx = await game.win();

  // did you win? Check the transaction receipt!
  // if you did, it will be in both the logs and events array
  const receipt = await tx.wait();
  console.log(receipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
