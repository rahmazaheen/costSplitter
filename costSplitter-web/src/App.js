import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Event from './event/event'
import Expense from './expense/expense'
import ExpenseCondensed from './expense-condensed/expense-condensed';
import EventCondensed from './event-condensed/event-condensed';
import HttpService from './services/http-services';
import HttpServiceEvent from './services/http-service-event';


class App extends Component {
    constructor(props) {
        console.log("constructor called")
        super(props);
        this.state = {id:''}
    } 

eventIdfound = (data) =>{
    console.log(data)
    this.setState({id:data}, () => {console.log(this.state);})
};


printId = () =>{
    console.log(this.state)
}

render(){
return (
    <Router>
        <div className="App">
            <Switch>
                <Route exact path="/">
                    <Event data={{id:this.state.id, eventIdfound:this.eventIdfound.bind(this),printId:this.printId.bind(this)}}/>
                </Route>
                <Route exact path={"/expense/"}>
                    <Expense data={{id:this.state.id}}/>
                </Route>
            </Switch>
        </div>
    </Router>
);
}
}



export default App;
