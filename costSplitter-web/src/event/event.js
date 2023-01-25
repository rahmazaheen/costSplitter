import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class Event extends Component {

    constructor(props){
        super(props);     
        this.doFunction = this.doFunction.bind(this);  
    }
 


    doFunction = () => {
        //        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://localhost:3004/event");
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        console.log(xhr.status);
                        console.log(xhr.responseText);
                    }
                }
                
                var uId = document.getElementById("uniqueId").value;
                var title = document.getElementById("eventName").value;
                var people = document.getElementById("peopleName").value;
                var obj = {};
                obj['uniqueId'] = uId;
                obj['title'] = title;
                obj['people'] = people.split(',');

                var data = JSON.stringify(obj);
                alert(data)
                xhr.send(data);
                }

    handleSubmit = (event) =>{
        event.preventDefault();
    }
    
    
    render(){
        
        return(
            <div className="event">
            <header className="App-header">
                <div className="row">
                    <div className="col-sm-6">
                        <form className="form" onSubmit={this.handleSubmit}>
                            <div className="form-group mx-sm-3 mb-2">
                                <input type="text" className="form-control" id="existingId" placeholder="Enter Event ID"></input>
                            </div>
                            <Link to={"/expense/"}><button type="submit" className="btn btn-primary mb-2" onClick={() => {this.props.data.eventIdfound(document.getElementById("existingId").value);}}>Edit Existing Event</button></Link>      
                        </form>
                    </div>
                    <div className="col-sm-6">
                        <form className="form" onSubmit={this.handleSubmit}>
                            <div className="form-group mx-sm-3 mb-2">
                                <input type="text" className="form-control" id="uniqueId" placeholder="Unique Event ID"></input>
                                <input type="text" className="form-control" id="eventName" placeholder="Event Name"></input>
                                <input type="text" className="form-control" id="peopleName" placeholder="People Involved"></input>
                            </div>
                            <Link to={"/expense/"}><button type="submit" className="btn btn-primary mb-2" onClick={() => {this.doFunction(); {this.props.data.eventIdfound(document.getElementById("uniqueId").value)}}}>Create New Event</button></Link>   
                        </form>
                    </div>
                </div>
            </header>
        </div>
                );
    }
}

    

export default Event;