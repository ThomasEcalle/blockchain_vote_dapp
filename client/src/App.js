import React, {Component} from 'react';
import './App.css';
import './styles.css';
import OwnerLabel from "./components/OwnerLabel";
import SwitchTabs from "./components/SwitchTabs";

class App extends Component {

    state = {loading: true, drizzleState: null};

    componentDidMount() {
        const {drizzle} = this.props;

        this.unsubscribe = drizzle.store.subscribe(() => {

            const drizzleState = drizzle.store.getState();

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
                <p className="tab-title">Bienvenue à l'élection !</p>
                <OwnerLabel
                    drizzle={this.props.drizzle}
                    drizzleState={this.state.drizzleState}
                />
                <SwitchTabs
                    drizzle={this.props.drizzle}
                    drizzleState={this.state.drizzleState}
                />
            </div>

        );
    }
}

export default App;
