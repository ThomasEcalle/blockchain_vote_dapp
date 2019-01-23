import React from "react";
import './styles.css';
import ChooseContainer from "./ChooseContainer";

class CurrentElection extends React.Component {
    state = {
        getproposalsDataKey: null,
        isVoteStartedDataKey: null,
        isVoteEndedDataKey: null,
    };

    componentDidMount() {
        const {drizzle} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        const isVoteStartedDataKey = contract.methods["isVoteStarted"].cacheCall();
        const isVoteEndedDataKey = contract.methods["isVoteEnded"].cacheCall();
        const getproposalsDataKey = contract.methods["getProposals"].cacheCall();


        this.setState({getproposalsDataKey, isVoteStartedDataKey, isVoteEndedDataKey});
    }


    render() {
        const {DeBordaVoteContract} = this.props.drizzleState.contracts;

        const isVoteStarted = DeBordaVoteContract.isVoteStarted[this.state.isVoteStartedDataKey];
        const isVoteEnded = DeBordaVoteContract.isVoteEnded[this.state.isVoteEndedDataKey];

        if (isVoteStarted && isVoteStarted.value) {
            const getProposals = DeBordaVoteContract.getProposals[this.state.getproposalsDataKey];

            if (getProposals && getProposals.value.length > 0) {

                const items = getProposals.value.slice();
                return (
                    <div className="listContainer">
                        <p className="tab-title">
                            Pour voter, cliquez sur les noms suivant votre classement, puis cliquez sur voter
                        </p>
                        <ChooseContainer
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                            items={items}
                        />

                    </div>)
            }
        }
        else if (isVoteEnded && isVoteEnded.value) {
            return (<div><p className="tab-title">Vote fini ! voici le résultat</p></div>)
        }
        else {
            return (
                <div><p className="tab-title">L'éléction n'a pas encore commencé !</p></div>)
        }

    }
}

export default CurrentElection;