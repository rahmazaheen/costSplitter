import React, {Component} from 'react';
import EditExpense from '../edit-expense/edit-expense';
import './expense-condensed.css'


class ExpenseCondensed extends Component {
    
     constructor(props){
        super(props);  
        this.print = this.print.bind(this);    
        this.deleteExpense = this.deleteExpense.bind(this);    
        this.createPeopleList = this.createPeopleList.bind(this);
        // this.divideCost = this.divideCost.bind(this);
    }

    print=()=>{
        console.log(this.props.expenseData.expense);
    }

    deleteExpense = () => {
        console.log(this.props.expenseData.expense)
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "http://localhost:3004/expense/remove");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log(xhr.status);
                console.log(xhr.responseText);
            }
        }
        var obj ={};
        obj['expenseId'] = this.props.expenseData.expense._id;    
        var data = JSON.stringify(obj);
        alert(data)
        xhr.send(data);

        xhr.onload = () => {
            if (xhr.readyState === xhr.DONE) {
              if (xhr.status === 200) {
                this.props.expenseData.loadExpenseCondensed(this.props.expenseData.IdReload_expense);
                this.props.eventData.loadEventCondensed(this.props.eventData.IdReload_event);
                
              }
            }
          };
        }

    createPeopleList = (inputlist, color) =>{
        const list = inputlist.map((people) =>
            <button type="button" className={"btn btn-"+color+" btn-people btn-sm"}>{people}</button>
    );
        return (list);  
    }

    // divideCost = () => {        
    //     var length= this.props.expenseData.expense.people.length;
    //     var costPerPerson = this.props.expenseData.expense.cost/length;
    //     console.log("cost pp "+costPerPerson);
    //     for(var i=0; i<length;i++){
    //         this.props.expenseData.addToCostBreakdown(this.props.expenseData.expense.people[i],this.props.expenseData.expense.paidBy,costPerPerson)
    //     }        
    // }
    // componentDidMount(){
    //     this.divideCost();
    // }
    render(){    
        return(
            <div>                
                <li className="list-group-item expense-condensed">  
                <div className='row'>
                    <div className='col-sm-12 col-md-10'>                      
                        <p>{this.props.expenseData.expense.title} | ${this.props.expenseData.expense.cost}</p>
                        <h6>People involved: {this.createPeopleList(this.props.expenseData.expense.people,'warning')}</h6>
                        <h6>Paid by: {this.createPeopleList([this.props.expenseData.expense.paidBy],'danger')}</h6>

                        
                    </div>

                    <div className='col-sm-12 col-md-2'>
                        <button className="btn btn-outline-primary btn-sm" data-toggle="modal" data-target={"#"+JSON.stringify(this.props.expenseData.expense._id)} onClick={() => this.print()}>Edit</button>                
                        <button className="btn btn-outline-danger btn-sm" onClick={() => this.deleteExpense()}>Remove</button>   
                    </div>
                </div>
                </li> 
                

                <EditExpense expenseData={{expense:this.props.expenseData.expense,loadExpenseCondensed: this.props.expenseData.loadExpenseCondensed, IdReload_expense:this.props.expenseData.IdReload_expense}}/>
            </div>
            
        )
    }
}

export default ExpenseCondensed;