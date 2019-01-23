import React from "react";

class ElectionResult extends React.Component {
    state = {
        keys: []
    };

    componentDidMount() {
        const {drizzle, list, drizzleState} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;
        const keys = [];
        list.forEach((proposalId) => {
            console.log(`yo ${proposalId}`);
            const proposalDataKey = contract.methods["getProposalData"].cacheCall(proposalId, {from: drizzleState.accounts[0]});

            keys.push(proposalDataKey);
        });

        this.setState({keys});

    }

    getProposalsDatas = (keys, debordaVoteContact) => {
        const result = [];
        keys.forEach((key) => {
            const proposal = debordaVoteContact.getProposalData[key];
            if (proposal && proposal.value) {
                result.push(proposal.value);
            }
        });

        return result;
    };


    render() {
        const {list} = this.props;
        const {keys} = this.state;
        const {DeBordaVoteContract} = this.props.drizzleState.contracts;

        const results = this.getProposalsDatas(keys, DeBordaVoteContract);

        results.sort(function (first, second) {
            return second["voteCount"] - first["voteCount"];
        });

        if (list.length !== results.length) return (<div><p>Loading</p></div>);
        return (
            <div className="resultsContainer">
                {
                    results.map((proposal, index) =>
                        <div
                            className={index === 0 ? "winnerCard" : "card"}
                            key={proposal["id"]}
                        >
                            <div className={"cardContainer"}>
                                <p className={"cardName"}>{proposal["name"]}</p>
                                <p>Avec un nombre de vote de : {proposal["voteCount"]}</p>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default ElectionResult;