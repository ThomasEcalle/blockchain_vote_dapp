import React from "react";

class Procuration extends React.Component {
    state = {
        dataKey: null,
        input: '',
        isUserAbleToVoteDataKey: null,
        isVoteEndedDataKey: null,
    };

    componentDidMount() {
        const {drizzle} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        const isUserAbleToVoteDataKey = contract.methods["isUserAbleToVote"].cacheCall();
        const isVoteEndedDataKey = contract.methods["isVoteEnded"].cacheCall();

        this.setState({
            isUserAbleToVoteDataKey,
            isVoteEndedDataKey
        });
    }

    handleChange = e => {
        this.setState({input: e.target.value});
    };

    handleClick = () => {
        const {drizzle, drizzleState} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;


        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["delegate"].cacheSend(this.state.input, {
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
        const {DeBordaVoteContract} = this.props.drizzleState.contracts;
        const isUserAbleToVote = DeBordaVoteContract.isUserAbleToVote[this.state.isUserAbleToVoteDataKey];

        const isVoteEnded = DeBordaVoteContract.isVoteEnded[this.state.isVoteEndedDataKey];

        if (isVoteEnded && isVoteEnded.value) {
            return (<div>
                <p className="tab-title">Le vote est déjà terminé ! Vous arrivez un peu tard</p></div>)
        }
        else if (isUserAbleToVote && isUserAbleToVote.value == false) {
            return (<div>
                <p className="tab-title">Vous ne pouvez pas donner de procuration</p></div>)
        }
        return (<div>
            <p className="tab-title">Entrer la clé pour donner son vote à la personne correspondante</p>
            <input type="text" className="edit-text" onChange={this.handleChange}/>
            <input type="button" className="edit-button" value="Donner son vote" onClick={this.handleClick}/>
            <div className="status"><p clasName="p-status">{this.getTxStatus()}</p></div>

        </div>)
    }
}

export default Procuration;