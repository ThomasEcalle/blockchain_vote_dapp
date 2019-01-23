import React from "react";
import './styles.css';
import ChooseContainer from "./ChooseContainer";
import ElectionResult from "./ElectionResult";

class CurrentElection extends React.Component {
    state = {
        getproposalsDataKey: null,
        isVoteStartedDataKey: null,
        isVoteEndedDataKey: null,
        isUserAbleToVoteDataKey: null,
        hasUserAlreadyVoteDateKey: null,
    };

    componentDidMount() {
        const {drizzle} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        const isVoteStartedDataKey = contract.methods["isVoteStarted"].cacheCall();
        const isVoteEndedDataKey = contract.methods["isVoteEnded"].cacheCall();
        const getproposalsDataKey = contract.methods["getProposals"].cacheCall();
        const hasUserAlreadyVoteDateKey = contract.methods["hasUserVotedYet"].cacheCall();
        const isUserAbleToVoteDataKey = contract.methods["isUserAbleToVote"].cacheCall();

        this.setState({
            getproposalsDataKey,
            isVoteStartedDataKey,
            isVoteEndedDataKey,
            hasUserAlreadyVoteDateKey,
            isUserAbleToVoteDataKey
        });
    }


    render() {
        const {DeBordaVoteContract} = this.props.drizzleState.contracts;

        const isVoteStarted = DeBordaVoteContract.isVoteStarted[this.state.isVoteStartedDataKey];
        const isVoteEnded = DeBordaVoteContract.isVoteEnded[this.state.isVoteEndedDataKey];
        const hasUserAlreadyVote = DeBordaVoteContract.hasUserVotedYet[this.state.hasUserAlreadyVoteDateKey];
        const getProposals = DeBordaVoteContract.getProposals[this.state.getproposalsDataKey];
        const isUserAbleToVote = DeBordaVoteContract.isUserAbleToVote[this.state.isUserAbleToVoteDataKey];

        console.log(`getProposals value = ${JSON.stringify(getProposals)}`);
        if (isVoteEnded && isVoteEnded.value && getProposals && getProposals.value) {
            const items = getProposals.value;
            return (
                <div>
                    <p className="tab-title">Vote fini ! voici le résultat</p>
                    <ElectionResult
                        drizzle={this.props.drizzle}
                        drizzleState={this.props.drizzleState}
                        list={items}
                    />
                </div>
            )
        }
        else if (isVoteStarted && isVoteStarted.value) {

            if (hasUserAlreadyVote && hasUserAlreadyVote.value) {
                return (<p className="tab-title">
                    Votre vote est pris en compte ! Bientôt les résultats sur cette page
                </p>)
            }
            else if (isUserAbleToVote == null || isUserAbleToVote.value === false) {
                return (<p className="tab-title">
                    Vous n'avez pas le droit de vote
                </p>)
            }
            else if (getProposals && getProposals.value.length > 0) {

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
            else {
                return (
                    <p className="tab-title">
                        Aucuns candidats
                    </p>)
            }
        }
        else {
            return (
                <div><p className="tab-title">L'élection n'a pas encore commencé !</p></div>)
        }

    }
}

export default CurrentElection;