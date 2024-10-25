const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Level3Module", (m) => {
  const level3 = m.contract("Level3");

  return { level3 };
});
