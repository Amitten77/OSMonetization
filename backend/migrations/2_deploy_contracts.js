const LendingHand = artifacts.require("OSMonetization");

module.exports = function(deployer) {
  deployer.deploy(LendingHand);
};