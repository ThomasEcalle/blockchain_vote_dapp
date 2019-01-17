import React from "react";
import Proposal from "./Proposal";
import styles from './styles.css';
import NewElection from "./NewElection";

class CurrentElection extends React.Component {
    state = {dataKey: null};

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

            return (<div className={styles.listContainer}>
                <p className={styles.title}>Vous pouvez voter pour les personnes ci dessous</p>
                {listItems}
            </div>)
        }
        else
        {
            return (
                <div><p>Aucun candidat</p></div>)
        }

    }
}

export default CurrentElection;