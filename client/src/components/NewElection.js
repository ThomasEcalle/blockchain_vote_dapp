import React from "react";

class NewElection extends React.Component {
    state = {
        dataKey: null,
        input:  ''
    };

    handleChange = e => {
        this.setState({ input: e.target.value });
    };

    handleClick = () => {
        const {drizzle, drizzleState} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["candidateAsProposal"].cacheSend(this.state.input, {
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
       return (<div>
           <p>Entrez votre nom pour vous inscrire à l'élection</p>
            <input type="text" className="edit-text" onChange={ this.handleChange }/>
            <input type="button" className="edit-text" value="Se présenter" onClick={this.handleClick}/>
           <div>{this.getTxStatus()}</div>

       </div>)
    }
}

export default NewElection;