import React, {Component} from 'react';



class EditEvent extends Component {
    
     constructor(props){
        super(props);
        this.doFunction = this.doFunction.bind(this);
                    
    }
   
    doFunction = () => {
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
                var title = document.getElementById("editEventTitle"+JSON.stringify(this.props.eventData.event._id)).value;

                var obj = {};
                console.log(title.length)

                if(title.length===0){obj['title']=this.props.eventData.event.title}else{obj['title'] = title;}

                obj['uniqueId'] = this.props.eventData.event.uniqueId;
                
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
    
    render(){
        console.log(this.props.eventData.event)
        return(            
            <div className="modal" id={JSON.stringify(this.props.eventData.event._id)} tabindex="-1" role="dialog" aria-labelledby="editEventLModal" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    {/* <h5 className="modal-title text-dark" id="editEventLModal">Edit {this.props.eventData.event.title}</h5> */}
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body text-dark">
                    <form className="form" onSubmit={this.handleSubmit}>
                        <div className="form-group mx-sm-3 mb-2">
                            <input type="text" className="form-control" id={"editEventTitle"+JSON.stringify(this.props.eventData.event._id)} placeholder={"Edit "+"'"+this.props.eventData.event.title+"'" }></input>                      
                        </div>
                    </form> 
                </div>
                <div class="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={() => this.doFunction()} data-dismiss="modal">Save changes</button>
                    
                </div>
                </div>
            </div>
            </div>
        )
    }
}

export default EditEvent;