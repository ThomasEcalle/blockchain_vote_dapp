pragma solidity >=0.4.22 <0.6.0;


contract VoteContractInterface {

    /////////////////////////////////////////////
    // Structs
    /////////////////////////////////////////////

    struct Voter {
        uint weight;
        bool voted;
        address[] vote;
        address delegate;
        bool canVote;
    }

    struct Proposal {
        uint voteCount;
        string name;
    }

    /////////////////////////////////////////////
    // Fields
    /////////////////////////////////////////////

    address owner;
    bool hasVoteStarted = false;
    mapping(address => Voter) voters;
    mapping(address => Proposal) proposals;
    address[] proposalsAddresses;


    /////////////////////////////////////////////
    // Modififiers
    /////////////////////////////////////////////

    // Accessible only if the caller is the owner
    modifier onlyOwner() {
        if (msg.sender != owner) return;
        _;
    }

    // Accessible only if voter has not voted yet
    modifier hasNotVotedYet(address voter) {
        if (voters[voter].voted) return;
        _;
    }

    // Accessible only if voter is enable to vote
    modifier mayVote(address voter) {
        if (hasVoteStarted == false || voters[voter].voted || !voters[voter].canVote) return;
        _;
    }

    // Accessible only if the proposalId is one of the
    // possible proposals
    modifier isOneOfPossibleProposal(address proposalAddress) {
        if (isEmptyString(proposals[proposalAddress].name)) return;
        _;
    }

    // Accessible only if all the proposals are in array
    modifier arePossibleProposals(address[] p) {
        if (p.length != proposalsAddresses.length) return;

        for (uint8 i = 0; i < p.length; i++) {
            // Look for unique proposals (can't vote twice for same candidate)
            uint8 count = 0;
            for (uint8 j = 0; j < p.length; j++) {
                if (p[j] == p[i]) count++;
            }
            if (count > 1) return;
            if (isEmptyString(proposals[p[i]].name)) return;
        }
        _;
    }

    // May be candidate only if vote has not started or if not already candidate
    modifier mayBeCandidate() {
        if (hasVoteStarted || isEmptyString(proposals[msg.sender].name) == false) return;
        _;
    }

    /////////////////////////////////////////////
    // Common methods
    /////////////////////////////////////////////

    function startVote() onlyOwner public {
        hasVoteStarted = true;
    }

    function isVoteStarted() public view returns (bool) {
        return hasVoteStarted;
    }

    /////////////////////////////////////////////
    // Utils methods
    /////////////////////////////////////////////

    function fromAddressToString(address x) pure public returns (string) {
        bytes memory b = new bytes(20);
        for (uint i = 0; i < 20; i++)
            b[i] = byte(uint8(uint(x) / (2 ** (8 * (19 - i)))));
        return string(b);
    }

    function isEmptyString(string text) pure public returns (bool) {
        return bytes(text).length == 0;
    }
}
