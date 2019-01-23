import React from "react";

class Candidatures extends React.Component {
    state = {
        dataKey: null,
        isVoteStartedDataKey: null,
        isVoteEndedDataKey: null,
        isUserAlreadyProposalDataKey: null,
        input: ''
    };

    componentDidMount() {
        const {drizzle} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;
        const isVoteStartedDataKey = contract.methods["isVoteStarted"].cacheCall();
        const isVoteEndedDataKey = contract.methods["isVoteEnded"].cacheCall();
        const isUserAlreadyProposalDataKey = contract.methods["isUserProposalYet"].cacheCall();
        this.setState({isVoteStartedDataKey, isVoteEndedDataKey, isUserAlreadyProposalDataKey});
    }

    handleChange = e => {
        this.setState({input: e.target.value});
    };

    handleClick = () => {
        const {drizzle, drizzleState} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        const stackId = contract.methods["candidateAsProposal"].cacheSend(this.state.input, {
            from: drizzleState.accounts[0]
        });

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

        const isVoteStarted = DeBordaVoteContract.isVoteStarted[this.state.isVoteStartedDataKey];
        const isVoteEnded = DeBordaVoteContract.isVoteEnded[this.state.isVoteEndedDataKey];
        const isUserAlreadyProposal = DeBordaVoteContract.isUserProposalYet[this.state.isUserAlreadyProposalDataKey];

        console.log(`isUserAlreadyproposa : ${JSON.stringify(isUserAlreadyProposal)}`)

        if (isVoteEnded && isVoteEnded.value) {
            return (<div><p className="tab-title">
                Le vote est déjà terminé ! Vous arrivez un peu tard
            </p></div>)
        }
        else if (isVoteStarted && isVoteStarted.value) {
            return (<div><p className="tab-title">
                Le vote a déjà commencé !
            </p></div>)
        }

        else if (isUserAlreadyProposal && isUserAlreadyProposal.value) {
            return (<div><p className="tab-title">
                Votre candidature a été prise en compte :)
            </p></div>)
        }
        return (<div>
            <p className="tab-title">Entrez votre nom pour vous inscrire à l'élection</p>
            <input type="text" className="edit-text" onChange={this.handleChange}/>
            <input type="button" className="edit-button" value="Se présenter" onClick={() => this.handleClick()}/>
            <div className="status"><p className="p-status">{this.getTxStatus()}</p></div>

        </div>)

    }
}

export default Candidatures;