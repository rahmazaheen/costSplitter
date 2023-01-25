import React, {Component} from 'react';
import './event-condensed.css';
import EditEvent from '../edit-event/edit-event';
import EventPeople from './event-people';

class EventCondensed extends Component {
    
     constructor(props){
        super(props);
        this.createEventPeople= this.createEventPeople.bind(this);
        this.deleteMember = this.deleteMember.bind(this);
        this.addMember = this.addMember.bind(this);
        this.CBD = {};
                    
    }

    createEventPeople = () =>{
        const list = this.props.eventData.event_top.people?.map((people) =>
        // <button key={people} type="button" className="btn btn-warning btn-eventPeople btn-sm">{people} <button id={people} className="btn btn-warning" onClick={this.deleteMember}>x</button></button>
        <EventPeople data={{people:people, deleteMember:this.deleteMember.bind(this),breakdown:[this.CBD[people]]}}/>
        );        
        return (list);
    }

    addMember = () => {
        //        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
                console.log("trying here")
                console.log(this.props.event)
                var xhr = new XMLHttpRequest();
                xhr.open("PUT", "http://localhost:3004/event");
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        console.log(xhr.status);
                        console.log(xhr.responseText);
                    }
                }                
                var addMember = document.getElementById("addEventMember").value;

                var obj = {};
                console.log(addMember.length)

                

                if(addMember.length===0){
                    obj['people']=this.props.eventData.event_top.people;
                }
                else{
                    this.props.eventData.event_top.people.push(addMember);
                    obj['people']=this.props.eventData.event_top.people;
                }

                obj['uniqueId'] = this.props.eventData.event_top.uniqueId;
                
                var data = JSON.stringify(obj);
                alert(data)
                xhr.send(data);

                xhr.onload = () => {
                    if (xhr.readyState === xhr.DONE) {
                      if (xhr.status === 200) {
                        this.props.eventData.loadEventCondensed(this.props.eventData.IdReload_event);
                        
                      }
                    }
                  };
                }

    deleteMember = (event) => {
        const id = event.target.id;
        console.log("deleting"+id)
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "http://localhost:3004/event/member");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log(xhr.status); 
                console.log(xhr.responseText);
            }
        }

        var obj ={};
        obj['eventId'] = this.props.eventData.event_top.uniqueId;  
        obj['removeMember'] = id;   
        var data = JSON.stringify(obj);
        alert(data)
        xhr.send(data);

        xhr.onload = () => {
            if (xhr.readyState === xhr.DONE) {
              if (xhr.status === 200) {
                this.props.eventData.loadEventCondensed(this.props.eventData.IdReload_event);
                this.props.eventData.loadExpenseCondensed(this.props.eventData.IdReload_event);
              }
            }
          };
        }

    
    render(){
        console.log("break down passed in ")
        this.CBD = this.props.eventData.loadCBD();
        console.log(this.CBD)
        return(
            <div>                
                <h3 className="event-title">{this.props.eventData.event_top.title} <button className="btn btn-primary text-light btn-sm btn-editEvent" data-toggle="modal" data-target={"#"+JSON.stringify(this.props.eventData.event_top._id)}>Edit Event Title</button> </h3>
                
                <div className="text-dark event-people">
                    {this.createEventPeople()}
                    <button className="btn btn-success btn-eventPeople btn-addPeople btn-sm" data-toggle="modal" data-target="#addMember">+</button>
                </div>
                
                <div className="modal" id="addMember" tabindex="-1" role="dialog" aria-labelledby="addMemberModal" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body text-dark">
                            <form className="form" onSubmit={this.handleSubmit}>
                                <div className="form-group mx-sm-3 mb-2">
                                    <input type="text" className="form-control" id={"addEventMember"} placeholder="Enter name"></input>                      
                                </div>
                            </form> 
                        </div>
                        <div class="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => this.addMember()} data-dismiss="modal">Add</button>
                            
                        </div>
                        </div>
                    </div>
                </div>

                <EditEvent eventData={{event:this.props.eventData.event_top, loadEventCondensed: this.props.eventData.loadEventCondensed, IdReload_event:this.props.eventData.IdReload_event}}/>
            </div>
            
        )
    }
}

export default EventCondensed;