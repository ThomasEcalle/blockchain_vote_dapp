pragma solidity >=0.4.22 <0.6.0;

import "./VoteContractInterface.sol";

contract DeBordaVoteContract is VoteContractInterface {

    constructor() public {
        owner = msg.sender;
        voters[owner].weight = 1;
        voters[owner].canVote = true;
    }

    function candidateAsProposal(string name) mayBeCandidate public {
        proposalsAddresses.push(msg.sender);
        proposals[msg.sender].voteCount = 0;
        if (isEmptyString(name)) {
            name = fromAddressToString(msg.sender);
        }
        proposals[msg.sender].name = name;
    }

    // Give $(toVoter) the right to vote.
    // May only be called by $(owner).
    function giveRightToVote(address toVoter) public onlyOwner hasNotVotedYet(toVoter) {
        voters[toVoter].weight = 1;
        voters[toVoter].canVote = true;
    }

    // Delegate sender's vote to the voter $(to).
    function delegate(address to) public mayVote(msg.sender) {
        Voter storage sender = voters[msg.sender];

        while (voters[to].delegate != address(0) && voters[to].delegate != msg.sender)
            to = voters[to].delegate;
        if (to == msg.sender || voters[to].canVote == false) return;
        sender.voted = true;
        sender.delegate = to;
        Voter storage delegateTo = voters[to];
        if (delegateTo.voted) {
            for (uint8 i = 0; i < delegateTo.vote.length; i++) {
                proposals[delegateTo.vote[i]].voteCount += (proposalsAddresses.length - i) * sender.weight;
            }
        }
        else {
            delegateTo.weight += sender.weight;
        }
    }

    // Vote for proposals
    function vote(address[] proposalsInOrder) public mayVote(msg.sender) arePossibleProposals(proposalsInOrder) {
        Voter storage sender = voters[msg.sender];
        sender.voted = true;
        sender.vote = proposalsInOrder;
        for (uint8 i = 0; i < proposalsInOrder.length; i++) {
            proposals[proposalsInOrder[i]].voteCount += (proposalsInOrder.length - i) * sender.weight;
        }
    }

    // Retrieve data for one proposal $(proposalId)
    function getProposalData(address proposalId) public view isOneOfPossibleProposal(proposalId) returns (address id, string name, uint voteCount) {
        id = proposalId;
        name = proposals[proposalId].name;
        voteCount = proposals[proposalId].voteCount;
    }

    function getProposals() public view returns (address[] proposals) {
        return proposalsAddresses;
    }

    function winningProposal() public view returns (address winningProposalAddress, string winningProposalName, uint winningProposalVoteCount) {
        uint256 winningVoteCount = 0;
        for (uint8 proposalIndex = 0; proposalIndex < proposalsAddresses.length; proposalIndex++) {
            address proposalAddress = proposalsAddresses[proposalIndex];
            if (proposals[proposalAddress].voteCount > winningVoteCount) {
                winningVoteCount = proposals[proposalAddress].voteCount;
                winningProposalAddress = proposalAddress;
                winningProposalName = proposals[proposalAddress].name;
                winningProposalVoteCount = winningVoteCount;
            }
        }
    }
}
