const DeBordaVoteContract = artifacts.require("./DeBordaVoteContract.sol");

contract("DeBordaVoteContract", accounts => {

    const owner = accounts[0];
    const candice = accounts[1];
    const thomas = accounts[2];
    const timothee = accounts[3];
    const bob = accounts[4];

    it("Should be able to apply as candidate", async () => {
        const myVoteContract = await DeBordaVoteContract.deployed();

        // Declare as candidate
        await myVoteContract.candidateAsProposal("candice", {from: candice});
        await myVoteContract.candidateAsProposal("tim", {from: timothee});
        await myVoteContract.candidateAsProposal("sanchyu", {from: thomas});

        // Get infos from candidate
        const proposals = await myVoteContract.getProposals.call();
        const second = proposals[1];
        assert.equal(second, timothee, "Timothee should be candidate");
    });

    it("Should not be able to vote as vote has not started", async () => {
        const myVoteContract = await DeBordaVoteContract.deployed();

        // Vote for proposal candice
        await myVoteContract.vote([candice, thomas, timothee], {from: owner});

        // Get candice vote count that should be still 0
        const candiceDatas = await myVoteContract.getProposalData.call(candice);
        const candiceCount = candiceDatas[2];
        assert.equal(candiceCount, 0, "Candice should have 0 votes");
    });

    it("Owner should start the vote", async () => {
        const myVoteContract = await DeBordaVoteContract.deployed();

        // Start vote
        await myVoteContract.startVote({from: owner});

        const isVoteStarted = await myVoteContract.isVoteStarted.call();
        assert.equal(isVoteStarted, true, "Vote should be started");
    });

    it("Should not be able to apply as candidate as vote started", async () => {
        const myVoteContract = await DeBordaVoteContract.deployed();

        // Bob try to apply as proposal
        await myVoteContract.candidateAsProposal("bob le bricoleur", {from: bob});

        // should not be proposal
        const bobDatas = await myVoteContract.getProposalData.call(bob);
        const bobName = bobDatas[1];
        assert.equal(bobName, "", "Bob should not be a valid proposal");
    });

    it("Should be able to vote", async () => {
        const myVoteContract = await DeBordaVoteContract.deployed();

        // Vote for proposal candice, tim and thomas in order
        await myVoteContract.vote([candice, timothee, thomas], {from: owner});

        // Get actual winner
        const winnerDatasArray = await myVoteContract.winningProposal.call();
        const winnerName = winnerDatasArray[1];
        assert.equal(winnerName, "candice", "The winner is note Candice");
    });

    it("Should not be able to vote twice", async () => {
        const myVoteContract = await DeBordaVoteContract.deployed();

        // Vote twice for proposal candice from owner (not possible)
        await myVoteContract.vote([candice, timothee, thomas], {from: owner});

        // Get actual winner
        const winnerDatasArray = await myVoteContract.winningProposal.call();
        const winnerVoteCount = winnerDatasArray[2];
        assert.equal(winnerVoteCount, 3, "Should only count 1 vote");
    });

    it("Should not have the rights to vote", async () => {
        const myVoteContract = await DeBordaVoteContract.deployed();

        await myVoteContract.vote([thomas, timothee, candice], {from: candice});

        // The propsal timothe should have still 0 votes
        const proposalData = await myVoteContract.getProposalData.call(timothee);
        const voteCount = proposalData[2];
        assert.equal(voteCount, 2, "Should still have 2 votes");

    });

    it("Should enable user to vote", async () => {
        const myVoteContract = await DeBordaVoteContract.deployed();

        // Owner give rights to vote to candice and thomas
        await myVoteContract.giveRightToVote(candice, {from: owner});
        await myVoteContract.giveRightToVote(thomas, {from: owner});
        await myVoteContract.giveRightToVote(timothee, {from: owner});

        // thomas  may now vote for proposals
        await myVoteContract.vote([candice, timothee, thomas], {from: thomas});

        const winnerInfosArray = await myVoteContract.winningProposal.call();
        const winnerVoteCount = winnerInfosArray[2];
        assert.equal(winnerVoteCount, 6, "Should have the vote of Candice");
    });

    it("Should not be able to vote for same person", async () => {
        const myVoteContract = await DeBordaVoteContract.deployed();

        // candice try to vote twice for her
        await myVoteContract.vote([candice, candice, thomas], {from: candice});

        const winnerInfosArray = await myVoteContract.winningProposal.call();
        const winnerVoteCount = winnerInfosArray[2];
        assert.equal(winnerVoteCount, 6, "The vote should not pass");
    });

    it("Should be able to give procuration", async () => {
        const myVoteContract = await DeBordaVoteContract.deployed();

        // candice give a procuration to thomas
        await myVoteContract.delegate(thomas, {from: candice});

        const winnerInfosArray = await myVoteContract.winningProposal.call();
        const winnerVoteCount = winnerInfosArray[2];
        assert.equal(winnerVoteCount, 9, "Candice proposal should have the votes from thomas");
    });


});