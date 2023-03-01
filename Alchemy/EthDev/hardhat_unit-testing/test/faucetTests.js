const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect, assert } = require("chai");

describe("Faucet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy();

    const [owner, signer2] = await ethers.getSigners();

    console.log("Signer 1 address: ", owner.address);

    let withdrawAmount = ethers.utils.parseUnits("1", "ether");

    //send some eth
    let value = ethers.utils.parseEther("2");
    await owner.sendTransaction({ to: faucet.address, value });

    const provider = ethers.getDefaultProvider();

    return { faucet, owner, signer2, withdrawAmount, provider, value };
  }

  it("should deploy and set the owner correctly", async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it("should not allow withdrawals over .1 eth", async function () {
    const { faucet, withdrawAmount } = await loadFixture(
      deployContractAndSetVariables
    );

    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it("should not allow withdrawAll() to be called by a non-owner", async function () {
    const { faucet, signer2 } = await loadFixture(
      deployContractAndSetVariables
    );

    await expect(faucet.connect(signer2).withdrawAll()).to.be.reverted;
  });

  it("should not allow destroyFaucet() to be called by a non-owner", async function () {
    const { faucet, signer2 } = await loadFixture(
      deployContractAndSetVariables
    );

    await expect(faucet.connect(signer2).destroyFaucet()).to.be.reverted;
  });

  it("owner should get contracts balance after withdrawAll()", async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    const ownerBalance = await ethers.provider.getBalance(owner.address);

    const withdrawAction = await faucet.withdrawAll();
    await withdrawAction.wait();

    const ownerBalanceAft = await ethers.provider.getBalance(owner.address);

    assert.isAbove(ownerBalanceAft, ownerBalance);
  });

  it("contract balance should be 0 after withdrawAll()", async function () {
    const { faucet } = await loadFixture(deployContractAndSetVariables);

    const withdrawAction = await faucet.withdrawAll();
    await withdrawAction.wait();

    const contractBalanceAft = await ethers.provider.getBalance(faucet.address);

    assert.equal(contractBalanceAft, 0);
  });
});
