const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StringRegistryModule", (m) => {
  const stringRegistry = m.contract("StringRegistry", []);

  return { stringRegistry };
});