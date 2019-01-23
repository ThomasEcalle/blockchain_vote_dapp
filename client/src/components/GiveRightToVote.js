import React from "react";
import './styles.css';

class GiveRightToVote extends React.Component {
    state = {
        dataKey: null,
        input:  '',
        stackId: null
    };

    handleChange = e => {
        this.setState({ input: e.target.value });
    };

    handleClick = () => {
        const {drizzle, drizzleState} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        const address = this.state.input;
        console.log(`GiveRightToVote to address : ${address}`);

        const stackId = contract.methods["giveRightToVote"].cacheSend(address, {
            from: drizzleState.accounts[0]
        });

        this.setState({stackId});
    };

    getTxStatus = () => {
        const {transactions, transactionStack} = this.props.drizzleState;

        const txHash = transactionStack[this.state.stackId];

        if (!txHash) return null;

        console.log(`Status : ${transactions[txHash].status}`);
        return `Transaction status: ${transactions[txHash].status}`;
    };
    render() {

        return (
            <div>
                <p className="tab-title">Entrer la clé pour donner le droit de vote</p>
                <input type="text" className="edit-text" onChange={ this.handleChange }/>
                <input type="button" className="edit-button" value="Donner le droit de vote" onClick={this.handleClick}/>
                <div className="status"><p className="p-status">{this.getTxStatus()}</p></div>
            </div>
        )
    }

}

export default GiveRightToVote;