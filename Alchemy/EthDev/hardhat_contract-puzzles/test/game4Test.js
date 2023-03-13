const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game4", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game4");
    const game = await Game.deploy();

    const signer0 = ethers.provider.getSigner(0);
    const signer1 = ethers.provider.getSigner(1);

    const address0 = await signer0.getAddress();
    const address1 = await signer1.getAddress();

    return { game, signer0, signer1, address0, address1 };
  }
  it("should be a winner", async function () {
    const { game, signer0, signer1, address0, address1 } = await loadFixture(
      deployContractAndSetVariables
    );

    // nested mappings are rough :}
    await game.connect(signer0).write(address1);

    await game.connect(signer1).win(address0);

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
