import React from "react";
import styles from './styles.css';

class Proposal extends React.Component {
    state = {dataKey: null};

    componentDidMount() {
        const {drizzle, id, drizzleState} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        // let drizzle know we want to watch the `myString` method
        const dataKey = contract.methods["getProposalData"].cacheCall(id, {from: drizzleState.accounts[0]});

        // save the `dataKey` to local component state for later reference
        this.setState({dataKey});
    }

    render() {
        // get the contract state from drizzleState
        const {DeBordaVoteContract} = this.props.drizzleState.contracts;

        // using the saved `dataKey`, get the variable we're interested in
        const getProposalData = DeBordaVoteContract.getProposalData[this.state.dataKey];

        if (getProposalData == null )
        {
         return(<p className={styles.title}>Loading</p>);
        }
        else
        {
            const value = getProposalData.value;
            return (
                <div>
                    <p className={styles.title}>{value[1]}</p>
                </div>)

        }

    }
}

export default Proposal;