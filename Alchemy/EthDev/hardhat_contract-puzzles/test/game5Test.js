const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    var wallet = ethers.Wallet.createRandom().connect(ethers.provider);
    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";

    while (parseInt(wallet.address) >= parseInt(threshold)) {
      wallet = ethers.Wallet.createRandom().connect(ethers.provider);
    }

    const signer0 = ethers.provider.getSigner(0);
    // console.log("signer balance: ", await signer0.getBalance());

    await signer0.sendTransaction({
      to: wallet.address,
      value: ethers.utils.parseEther("1"),
    });

    // console.log("wallet balance: ", await wallet.getBalance());

    return { game, wallet };
  }
  it("should be a winner", async function () {
    const { game, wallet } = await loadFixture(deployContractAndSetVariables);

    // good luck

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
