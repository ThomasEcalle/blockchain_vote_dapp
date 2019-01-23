import React from 'react';
import './styles.css';
import Proposal from "./Proposal";

class ResultList extends React.Component {

    renderProposal(proposalId) {
        return (
            <Proposal
                id={proposalId}
                showVoteCount={true}
                onClick={(id) => this.onItemClicked(id)}
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
                className="listProposals"
                key={proposalId}
            />);
    }

    render() {
        const {list} = this.props;
        return (<div className="listSelector">
                {list.map(id => this.renderProposal(id))}
            </div>
        );
    }
}

export default ListSelector;