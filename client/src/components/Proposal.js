import React from "react";

class Proposal extends React.Component {
    state = {dataKey: null};

    componentDidMount() {
        const {drizzle, id, drizzleState} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        console.log(`GetProposalData with id = ${id}`);
        // let drizzle know we want to watch the `myString` method
        const dataKey = contract.methods["getProposalData"].cacheCall(id, {from: drizzleState.accounts[0]});

        // save the `dataKey` to local component state for later reference
        this.setState({dataKey});
    }

    onClick = (proposal) => {
        if (this.props.onClick) {
            this.props.onClick(proposal["id"])
        }
    };

    render() {
        const {DeBordaVoteContract} = this.props.drizzleState.contracts;
        const {showVoteCount} = this.props;

        const getProposalData = DeBordaVoteContract.getProposalData[this.state.dataKey];

        if (getProposalData == null) {
            return (<p className="tab-title">Loading...</p>);
        }

        else {
            const proposal = getProposalData.value;
            return (
                <div onClick={() => this.onClick(proposal)}>
                    <p className="p-selector">{proposal["name"]}</p>
                    {
                        showVoteCount && <p>Nombre de points : {proposal["voteCount"]}</p>
                    }
                </div>)

        }

    }
}

export default Proposal;