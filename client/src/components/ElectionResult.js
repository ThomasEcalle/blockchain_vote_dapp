import React from "react";

class ElectionResult extends React.Component {
    state = {dataKey: null};

    componentDidMount() {
        const {drizzle, id, drizzleState} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        // let drizzle know we want to watch the `myString` method
        const dataKey = contract.methods["winningProposal"].cacheCall();

        // save the `dataKey` to local component state for later reference
        this.setState({dataKey});
    }

    render() {
        // get the contract state from drizzleState
        const {DeBordaVoteContract} = this.props.drizzleState.contracts;

        // using the saved `dataKey`, get the variable we're interested in
        const winningProposal = DeBordaVoteContract.winningProposal[this.state.dataKey];

        if (winningProposal == null) {
            return (<p className="tab-title">L'élection n'est pas terminée</p>);
        }
        else {
            const value = winningProposal.value;
            return (
                <div>
                    <p className="p-status">{value[1]}</p>
                    <input type="button" className="edit-button" value="Voter" onClick={() => this.Vote(value[0])}/>

                </div>)

        }

    }
}

export default ElectionResult;