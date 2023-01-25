import React, {Component} from 'react';
import './event-condensed.css';


class EventPeople extends Component {
    
     constructor(props){
        super(props);  
        this.displayBreakdown=this.displayBreakdown.bind(this);
    }

    displayBreakdown = (breakdown,name) =>{
        delete breakdown[name];
        let entries = Object.entries(breakdown)   
        const list = entries?.map((entry) =>
            <p>{`You owe ${entry[0]} $${entry[1]}`}</p>
        );        
        return (list);
    }

    render(){    
        let entries = Object.entries(this.props.data.breakdown[0])
        console.log(entries)
        
        return(
            <div className='event-people'>
            <button key={this.props.data.people} type="button" data-toggle="modal" data-target={"#"+this.props.data.people+"modal"} className="btn btn-warning btn-eventPeople btn-sm">{this.props.data.people} <button id={this.props.data.people} className="btn btn-warning" onClick={this.props.data.deleteMember}>x</button></button>
            <div class="modal fade" id={this.props.data.people+"modal"} tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div className="modal-body text-dark">
                            
                           {this.displayBreakdown(this.props.data.breakdown[0],this.props.data.people)}
                        
                        {/* <pre>
                            <code>                         
                        {JSON.stringify(this.props.data.breakdown[0],null,2)}
                            </code>
                        </pre> */}

                    {/* {JSON.parse(this.props.data.breakdown)} */}

                        </div>
                    </div>
                </div>
            </div>
            </div>

        )
    }
}

export default EventPeople;