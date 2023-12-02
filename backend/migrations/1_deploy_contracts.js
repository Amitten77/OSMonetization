const OSMonetization = artifacts.require("OSMonetization.sol");

module.exports = function (deployer) {
  deployer.deploy(OSMonetization);
};