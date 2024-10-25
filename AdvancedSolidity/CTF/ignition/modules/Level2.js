const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Level2Module", (m) => {
  const level2 = m.contract("Level2");

  return { level2 };
});
