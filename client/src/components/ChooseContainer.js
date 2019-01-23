import React from 'react';
import ListSelector from "./ListSelector";

class ChooseContainer extends React.Component {
    state = {proposals: [], proposalChoice: []};

    componentDidMount() {
        this.setState({proposals: this.props.items});
    }

    putInChoices(id) {
        console.log(`received click : ${JSON.stringify(id)}`);
        const proposalChoice = this.state.proposalChoice;
        const proposals = this.state.proposals;
        const index = proposals.indexOf(id);
        proposals.splice(index, 1);
        proposalChoice.push(id);
        this.setState({proposals, proposalChoice});
    }

    putOutChoices(id) {
        const proposalChoice = this.state.proposalChoice;
        const proposals = this.state.proposals;
        const index = proposalChoice.indexOf(id);
        proposalChoice.splice(index, 1);
        proposals.push(id);
        this.setState({proposals, proposalChoice});
    }

    vote(proposalChoices) {
        const {drizzle, drizzleState} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;


        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["vote"].cacheSend([], {
            from: drizzleState.accounts[0]
        });

        // save the `stackId` for later reference
        this.setState({stackId});
    };

    getTxStatus = () => {
        // get the transaction states from the drizzle state
        const {transactions, transactionStack} = this.props.drizzleState;

        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[this.state.stackId];

        // if transaction hash does not exist, don't display anything
        if (!txHash) return null;

        // otherwise, return the transaction status
        return `Transaction status: ${transactions[txHash].status}`;
    };

    render() {
        console.log(`Choose container rendering : ${JSON.stringify(this.state)}`);
        return (
            <div>
                <div className="containerListSelector">
                    <div className="listSelectorProposals">
                        <ListSelector drizzle={this.props.drizzle}
                                      drizzleState={this.props.drizzleState}
                                      list={this.state.proposals}
                                      onProposalClicked={(id) => this.putInChoices(id)}/>
                    </div>
                    <div className="listSelectorProposals">
                        <ListSelector drizzle={this.props.drizzle}
                                      drizzleState={this.props.drizzleState}
                                      list={this.state.proposalChoice}
                                      onProposalClicked={(id) => this.putOutChoices(id)}/>
                    </div>
                </div>

                <input type="button" className="edit-button" value="Voter"
                       onClick={() => this.vote(this.state.proposalChoice)}/>
                <div className="status"><p className="p-status">{this.getTxStatus()}</p></div>

            </div>


        );
    }
}

export default ChooseContainer;