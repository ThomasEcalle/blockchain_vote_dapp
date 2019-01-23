import React from "react";
import './styles.css';

class OwnerSection extends React.Component {
    state = {
        isVoteStartedDataKey: null,
        isVoteEndedDataKey: null,
        input: '',
        giveRightToVoteStackId: null,
        startVoteStackId: null,
        stopVoteStackId: null,
    };

    componentDidMount() {
        const {drizzle} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;
        const isVoteStartedDataKey = contract.methods["isVoteStarted"].cacheCall();
        const isVoteEndedDataKey = contract.methods["isVoteEnded"].cacheCall();
        this.setState({isVoteStartedDataKey, isVoteEndedDataKey});
    }

    handleChange = e => {
        this.setState({input: e.target.value});
    };

    startVote = () => {
        const {drizzle, drizzleState} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        const startVoteStackId = contract.methods["startVote"].cacheSend({
            from: drizzleState.accounts[0]
        });

        this.setState({startVoteStackId});
    };

    stopVote = () => {
        const {drizzle, drizzleState} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        const stopVoteStackId = contract.methods["stopVote"].cacheSend({
            from: drizzleState.accounts[0]
        });

        this.setState({stopVoteStackId});
    };

    sendProcuration = () => {
        const {drizzle, drizzleState} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        const address = this.state.input;
        console.log(`GiveRightToVote to address : ${address}`);

        const giveRightToVoteStackId = contract.methods["giveRightToVote"].cacheSend(address, {
            from: drizzleState.accounts[0]
        });

        this.setState({giveRightToVoteStackId, input: ''});
    };

    getProcurationStatus = () => {
        const {transactions, transactionStack} = this.props.drizzleState;

        const txHash = transactionStack[this.state.giveRightToVoteStackId];

        if (!txHash) return null;

        return `Transaction status: ${transactions[txHash].status}`;
    };

    getVoteStartingStatus = () => {
        const {transactions, transactionStack} = this.props.drizzleState;

        const txHash = transactionStack[this.state.startVoteStackId];

        if (!txHash) return null;

        return `Transaction status: ${transactions[txHash].status}`;
    };

    getVoteStoppingStatus = () => {
        const {transactions, transactionStack} = this.props.drizzleState;

        const txHash = transactionStack[this.state.stopVoteStackId];

        if (!txHash) return null;

        return `Transaction status: ${transactions[txHash].status}`;
    };

    renderStartingVoteButton() {
        return (
            <div>
                <p className="tab-title">Cliquez pour démarrer le vote !</p>
                < input
                    type="button"
                    className="edit-button"
                    value="Démarrer le vote"
                    onClick={this.startVote}
                />
                <div className="status">
                    <p className="p-status">{this.getVoteStartingStatus()}</p>
                </div>
            </div>
        )
    }

    renderEndingVoteButton() {
        return (
            <div>
                <p className="tab-title">Cliquez pour arrêter les votes (pour la démo uniquement) !</p>
                < input
                    type="button"
                    className="edit-button"
                    value="STOP"
                    onClick={this.stopVote}
                />
                <div className="status">
                    <p className="p-status">{this.getVoteStoppingStatus()}</p>
                </div>
            </div>
        )
    }

    render() {
        const {DeBordaVoteContract} = this.props.drizzleState.contracts;
        const isVoteStarted = DeBordaVoteContract.isVoteStarted[this.state.isVoteStartedDataKey];
        const isVoteEnded = DeBordaVoteContract.isVoteEnded[this.state.isVoteEndedDataKey];

        if (isVoteEnded && isVoteEnded.value) {
            return (<div>
                <p className="tab-title">Le vote est déjà terminé ! Vous arrivez un peu tard</p></div>)
        }
        return (
            <div>
                <div>
                    <p className="tab-title">Entrer la clé pour donner le droit de vote à la personne</p>
                    <input
                        type="text"
                        className="edit-text"
                        onChange={this.handleChange}
                    />
                    <input
                        type="button"
                        className="edit-button"
                        value="Donner le droit de vote"
                        onClick={this.sendProcuration}
                    />
                    <div className="status">
                        <p className="p-status">{this.getProcurationStatus()}</p>
                    </div>
                </div>
                {
                    isVoteStarted && !isVoteStarted.value && this.renderStartingVoteButton()
                }
                {
                    isVoteStarted && isVoteStarted.value && this.renderEndingVoteButton()
                }
            </div>
        )
    }

}

export default OwnerSection;