import React from "react";
import Proposal from "./Proposal";
import './styles.css';
import ChooseContainer from "./ChooseContainer";

class CurrentElection extends React.Component {
    state = {dataKey: null};
    Vote = (address) => {
        const {drizzle, drizzleState} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;


        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["vote"].cacheSend([], {
            from: drizzleState.accounts[0]
        });

        // save the `stackId` for later reference
        this.setState({stackId});
    };
    componentDidMount() {
        const {drizzle} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        // let drizzle know we want to watch the `myString` method
        const dataKey = contract.methods["getProposals"].cacheCall();

        // save the `dataKey` to local component state for later reference
        this.setState({dataKey});
    }

    render() {
        // get the contract state from drizzleState
        const {DeBordaVoteContract} = this.props.drizzleState.contracts;

        // using the saved `dataKey`, get the variable we're interested in
        const getProposals = DeBordaVoteContract.getProposals[this.state.dataKey];

        if (getProposals && getProposals.value.length > 0)
        {
            const listItems = getProposals.value.map((d) =>
                <Proposal id={d} drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />);
            return (<div className="listContainer">
                <p className="tab-title">Pour voter, déplacer les noms suivant votre classement, puis cliquez sur voter</p>
                <ChooseContainer drizzle={this.props.drizzle}
                                 drizzleState={this.props.drizzleState}
                                 items={getProposals.value}/>
                <input type="button" className="edit-button" value="Voter" onClick={() => this.Vote()}/>
            </div>)
        }
        else
        {
            return (
                <div><p className="tab-title">Aucun candidat</p></div>)
        }

    }
}

export default CurrentElection;