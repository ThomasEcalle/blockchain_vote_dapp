import React from 'react';
import './styles.css';
import Proposal from "./Proposal";

class ListSelector extends React.Component {
    onItemClicked(id) {
        this.props.onProposalClicked(id);
        console.log('onProposalClicked' + JSON.stringify(id));

    }

    render() {
        const {list} = this.props;
        return (<div className="listSelector">
            {list.map(id => <Proposal id={id}
                                     drizzle={this.props.drizzle}
                                     drizzleState={this.props.drizzleState}
                                     className="listProposals"
                                     key={id}
                                     onClick={(id) => this.onItemClicked(id)}/>)}
            </div>
        );
    }
}

export default ListSelector;