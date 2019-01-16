import React, {Component} from 'react';
import './App.css';
import './styles.css';
import Tabs from "./Tabs";
import OwnerLabel from "./components/OwnerLabel";
import NewElection from "./components/NewElection";
import CurrentElection from "./components/CurrentElection";

class App extends Component {

    state = {loading: true, drizzleState: null};

    componentDidMount() {
        const {drizzle} = this.props;

        // subscribe to changes in the store
        console.log("Suscribe");
        this.unsubscribe = drizzle.store.subscribe(() => {

            console.log("Suscribed");

            // every time the store updates, grab the state from drizzle
            const drizzleState = drizzle.store.getState();

            // check to see if it's ready, if so, update local component state
            if (drizzleState.drizzleStatus.initialized) {
                this.setState({loading: false, drizzleState});
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        if (this.state.loading) return "Loading Drizzle...";
        return (
            <div className="App">
                <p>Welcome to the election</p>
                <OwnerLabel
                    drizzle={this.props.drizzle}
                    drizzleState={this.state.drizzleState}
                />
                <Tabs>
                    <div label="Election en cours">
                        <CurrentElection
                            drizzle={this.props.drizzle}
                            drizzleState={this.state.drizzleState}
                        />
                    </div>
                    <div label="Start Election">
                        <NewElection
                            drizzle={this.props.drizzle}
                            drizzleState={this.state.drizzleState}
                        />
                    </div>
                    <div label="Procuration">
                        After 'while, <em>Crocodile</em>!
                    </div>
                    <div label="Result">
                        Nothing to see here, this tab is <em>extinct</em>!
                    </div>
                </Tabs>
            </div>

        );
    }
}

export default App;
