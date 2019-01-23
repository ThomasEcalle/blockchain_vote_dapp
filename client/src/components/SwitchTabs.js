import React from "react";
import CurrentElection from "./CurrentElection";
import NewElection from "./NewElection";
import Procuration from "./Procuration";
import Tabs from "../Tabs";
import OwnerSection from "./OwnerSection";

class SwitchTabs extends React.Component {
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
            return (
                <Tabs>
                    <div label="Election en cours">
                        <CurrentElection
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                        />
                    </div>
                    <div label="Candidatures">
                        <NewElection
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                        />
                    </div>
                    <div label="Procuration">
                        <Procuration
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                        />
                    </div>
                    <div label="Section Admin">
                        <OwnerSection
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                        />
                    </div>
                </Tabs>)

        }
        else {
            return (<Tabs>
                <div label="Election en cours">
                    <CurrentElection
                        drizzle={this.props.drizzle}
                        drizzleState={this.props.drizzleState}
                    />
                </div>
                <div label="Candidatures">
                    <NewElection
                        drizzle={this.props.drizzle}
                        drizzleState={this.props.drizzleState}
                    />
                </div>
                <div label="Procuration">
                    <Procuration
                        drizzle={this.props.drizzle}
                        drizzleState={this.props.drizzleState}
                    />
                </div>
            </Tabs>)
        }

    }
}

export default SwitchTabs;