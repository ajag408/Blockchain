// import testing libraries: https://www.chaijs.com/guide/styles/
const { expect, assert } = require("chai");

// the `describe` scope encapsulates an entire test called `TestModifyVariable`
// the `it` says the behavior that should be expected from the test
describe("TestModifyVariable", function () {
  it("should change x to 1337", async function () {
    // this line creates an ethers ContractFactory abstraction: https://docs.ethers.org/v5/api/contract/contract-factory/
    const ModifyVariable = await ethers.getContractFactory("ModifyVariable");

    // we then use the ContractFactory object to deploy an instance of the contract
    const contract = await ModifyVariable.deploy(10, "");

    // wait for contract to be deployed and validated!
    await contract.deployed();

    const oldX = await contract.x();
    console.log("OG x: ", oldX.toNumber());
    // modify x from 10 to 1337 via this function!
    var setter = await contract.modifyToLeet();
    console.log("setter: ", setter);
    // getter for state variable x
    const newX = await contract.x();
    console.log("New X: ", newX.toNumber());
    assert.equal(newX.toNumber(), 1337);
  });

  it("should change y to 'fack'", async function () {
    // this line creates an ethers ContractFactory abstraction: https://docs.ethers.org/v5/api/contract/contract-factory/
    const ModifyVariable = await ethers.getContractFactory("ModifyVariable");

    // we then use the ContractFactory object to deploy an instance of the contract
    const contract = await ModifyVariable.deploy(10, "");

    // wait for contract to be deployed and validated!
    await contract.deployed();
    // modify x from 10 to 1337 via this function!
    await contract.modifyString();
    // getter for state variable x
    const newY = await contract.y();
    assert.equal(newY.toString(), "fack");
  });
});
