import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import ExpenseCondensed from '../expense-condensed/expense-condensed';
import EventCondensed from '../event-condensed/event-condensed';
import './expense.css';
import HttpService from '../services/http-services';
import HttpServiceEvent from '../services/http-service-event';

const http = new HttpService();
const httpEvent = new HttpServiceEvent();

class Expense extends Component {

    constructor(props){
        super(props);   
        this.state = {expenses:[], events:[], num:0, costBreakdown:{}};
        this.loadData = this.loadData.bind(this);
        this.loadEvent = this.loadEvent.bind(this);
        this.Id = this.props.data.id
        this.loadEvent(this.Id);
        this.loadData(this.Id);
        this.doFunction = this.doFunction.bind(this);
        this.printexpenses = this.printexpenses.bind(this);
        this.createExpenseList = this.createExpenseList.bind(this);
        this.addToCostBreakdown = this.addToCostBreakdown.bind(this);
        this.calcCostBreakdown = this.calcCostBreakdown.bind(this);
        this.buildCBD = this.buildCBD.bind(this);
        this.costBreakdown = {};
    }

    loadData = (id) => {
        console.log(this.props.data)
        if (id.length!=0){
        http.getExpenses(id).then(data => {
           this.setState({expenses:data},this.buildCBD);
           console.log(this.state.expenses);
        }, err => {});
        }
        else{
            console.log("no Id")
        }
        

    }
    buildCBD =()=>{
        var CBD = {};
        for (let i = 0; i <this.state.events.people.length; i++){
         var temp={}
         for(let j=0; j<this.state.events.people.length; j++){
             temp[this.state.events.people[j]]=0;
         }            
         CBD[this.state.events.people[i]]=temp;
        }
        this.setState({costBreakdown:CBD},this.calcCostBreakdown);
        console.log(this.costBreakdown);
    }

    loadEvent = (id) => {
        console.log("loading event")
        console.log(this.props.data)
        if (id.length!=0){
        httpEvent.getEvent(id).then(data => {
           this.setState({events:data});
           console.log(this.state.events);
           var CBD = {};
           for (let i = 0; i <data.people.length; i++){
            var temp={}
            for(let j=0; j<data.people.length; j++){
                temp[data.people[j]]=0;
            }            
            CBD[data.people[i]]=temp;
           }
           this.setState({costBreakdown:CBD});
           console.log(this.costBreakdown)  
        //    for (let i = 0; i <data.people.length; i++){
        //     var temp={}
        //     for(let j=0; j<data.people.length; j++){
        //         temp[data.people[j]]=0;
        //     }
        //     this.costBreakdown[data.people[i]]=temp
        //    }
        //    console.log(this.costBreakdown)



        }, err => {});
        }
        else{
            console.log("no event")
        }
    }

    printexpenses = ()=>{
        console.log(this.state.expenses)
    }


    createExpenseList = () =>{
        const list = this.state.expenses.map((expense) =>
        <ExpenseCondensed expenseData={{expense:expense,loadExpenseCondensed:this.loadData.bind(this),loadEventCondensed:this.loadEvent.bind(this), IdReload_expense:this.Id, addToCostBreakdown: this.addToCostBreakdown.bind(this)}} />
        );
        return (list);
    }

    doFunction = () => {
        //        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://localhost:3004/expense");
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        console.log(xhr.status);
                        console.log(xhr.responseText);
                    }
                }
                
                var title = document.getElementById("title").value;
                var cost = document.getElementById("cost").value;
                var people = document.getElementById("peopleName").value;
                var paidBy = document.getElementById("paidBy").value;
                // var completed = document.getElementById("completed").value;

                var obj = {};
                obj['eventId'] = this.Id;
                obj['title'] = title;
                obj['cost'] = cost;
                obj['people'] = people.split(',');
                obj['paidBy'] = paidBy;
                // obj['completed'] = completed;
                
                var data = JSON.stringify(obj);
                alert(data)
                xhr.send(data);

                xhr.onload = () => {
                    if (xhr.readyState === xhr.DONE) {
                      if (xhr.status === 200) {
                        this.loadData(this.Id)
                        
                      }
                    }
                  };

                }
    
    handleSubmit = (event) =>{
        event.preventDefault();
    }

    calcCostBreakdown = ()=>{
        let CB = this.state.costBreakdown;
        let expense_arr = this.state.expenses;
        for (let i = 0; i < expense_arr.length; i++) {
            let amount_pp = expense_arr[i].cost/expense_arr[i].people.length
            console.log("amount")
            console.log(amount_pp)
            for (let j = 0; j < expense_arr[i].people.length; j++){
                console.log('peeeeepaahh')
                console.log(expense_arr[i].people.length)
                CB[expense_arr[i].people[j]][expense_arr[i].paidBy]+=amount_pp
            }   
        }
        this.setState({costBreakdown:CB});
        
    }


    addToCostBreakdown = (owedBy, owedTo, amount) => {
        console.log("before state"+this.state.costBreakdown[owedBy][owedTo])
        var CBD = this.state.costBreakdown;
        CBD[owedBy][owedTo]+=amount;
        this.setState({costBreakdown:CBD});
        console.log("after state"+this.state.costBreakdown[owedBy][owedTo])
        console.log(this.state.costBreakdown);

    }
    loadCBD =()=>{
        return this.state.costBreakdown;
    }
              
        
    render(){
        
        return(
            <div className="expense">
                <header className="App-header">
                    <div className="container-fluid App-main">                           
                        <div className="row">
                            <div className='col-sm-12 add-expense'>
                                <div className="event-condensed"> 
                                    {/* <div>{this.state.costBreakdown}</div>  */}
                                    <EventCondensed eventData={{event_top:this.state.events,loadEventCondensed:this.loadEvent.bind(this), loadExpenseCondensed:this.loadData.bind(this), IdReload_event:this.Id, loadCBD: this.loadCBD.bind(this)}} />                      
                                </div>   
                                <div className='row add-expense'>
                                    <div className='col-sm-12 col-md-1'>
                                        <button type="submit" className="btn btn-success mb-2 btn-sm btn-add-expense"  data-toggle="modal" data-target="#addExpense">Add New Expense</button>
                                    </div>
                                </div>
                                <div className="modal" id="addExpense" tabindex="-1" role="dialog" aria-labelledby="addExpenseModal" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            {/* <h5 className="modal-title text-dark" id="addExpenseModal">Add New Expense</h5> */}
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                        <form className="form" onSubmit={this.handleSubmit}>
                                            <div className="form-group mx-sm-3 mb-2">
                                                <input type="text" className="form-control" id="title" placeholder="Title"></input>
                                                <input type="text" className="form-control" id="cost" placeholder="Cost"></input>
                                                <input type="text" className="form-control" id="peopleName" placeholder="People"></input>
                                                <input type="text" className="form-control" id="paidBy" placeholder="Paid by"></input>
                                            </div>
                                        </form>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary" onClick={() => this.doFunction()} data-dismiss="modal">Add Expense</button>                                            
                                        </div>
                                        </div>
                                    </div>
                                </div>                                 
                                <ul className="expense-condensed">  
                                    {this.createExpenseList()}
                                </ul>
                            </div>
                        </div>              

                    </div>
                </header>
            </div>
            );
    }
}

    

export default Expense;