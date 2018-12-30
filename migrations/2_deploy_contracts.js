const VoteContract = artifacts.require("DeBordaVoteContract");

module.exports = function (deployer) {
    deployer.deploy(VoteContract);
};