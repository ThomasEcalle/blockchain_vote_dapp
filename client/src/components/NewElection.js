import React from "react";

class NewElection extends React.Component {
    state = {dataKey: null};

    componentDidMount() {
        const {drizzle} = this.props;
        const contract = drizzle.contracts.DeBordaVoteContract;

        // let drizzle know we want to watch the `myString` method
        const dataKey = contract.methods["isOwner"].cacheCall();

        // save the `dataKey` to local component state for later reference
        this.setState({dataKey});
    }

    render() {
        // get the contract state from drizzleState
        const {DeBordaVoteContract} = this.props.drizzleState.contracts;

        // using the saved `dataKey`, get the variable we're interested in
        const isOwner = DeBordaVoteContract.isOwner[this.state.dataKey];

        // if it exists, then we display its value
        if (isOwner && isOwner.value) {
            return <input type="button" className="owner-input" value="Start Election"/>;
        }
        else {
        }

       return (<div>
           <p>Entrez votre nom pour vous inscrire à l'élection</p>
            <input type="text" className="edit-text"/>
            <input type="button" className="edit-text" value="Se présenter"/>
        </div>)
    }
}

export default NewElection;