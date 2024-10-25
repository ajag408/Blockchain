const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Level0Module", (m) => {
  const level0 = m.contract("Level0");

  return { level0 };
});
