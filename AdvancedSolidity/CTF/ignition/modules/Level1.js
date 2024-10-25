const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Level1Module", (m) => {
  const level1 = m.contract("Level1");

  return { level1 };
});
