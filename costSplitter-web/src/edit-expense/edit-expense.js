import React, {Component} from 'react';
import './edit-expense.css'



class EditExpense extends Component {
    
     constructor(props){
        super(props);
        this.doFunction = this.doFunction.bind(this);
                    
    }
   
    doFunction = () => {
        //        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
                console.log("trying here")
                console.log(this.props.expenseData.expense)
                var xhr = new XMLHttpRequest();
                xhr.open("PUT", "http://localhost:3004/expense");
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        console.log(xhr.status);
                        console.log(xhr.responseText);
                    }
                }
                
                var title = document.getElementById("edittitle"+JSON.stringify(this.props.expenseData.expense._id)).value;
                var cost = document.getElementById("editcost"+JSON.stringify(this.props.expenseData.expense._id)).value;
                var people = document.getElementById("editpeopleName"+JSON.stringify(this.props.expenseData.expense._id)).value.split(',');
                var paidBy = document.getElementById("editpaidBy"+JSON.stringify(this.props.expenseData.expense._id)).value;
                
                var obj = {};
                console.log(title.length)
                console.log(cost.length)
                console.log(paidBy.length)
                console.log(people.length)
                if(title.length===0){obj['title']=this.props.expenseData.expense.title}else{obj['title'] = title;}
                if(cost.length===0){obj['cost']=this.props.expenseData.expense.cost}else{obj['cost'] = cost;}
                if(paidBy.length===0){obj['paidBy']=this.props.expenseData.expense.paidBy}else{obj['paidBy'] = paidBy;}
                if(people[0]===""){obj['people']=this.props.expenseData.expense.people}else{obj['people'] = people;}

                obj['eventId'] = this.props.expenseData.expense.eventId;
                obj['expenseId'] = this.props.expenseData.expense._id;
                
                var data = JSON.stringify(obj);
                alert(data)
                xhr.send(data);

                xhr.onload = () => {
                    if (xhr.readyState === xhr.DONE) {
                      if (xhr.status === 200) {
                        this.props.expenseData.loadExpenseCondensed(this.props.expenseData.IdReload_expense);
                        
                      }
                    }
                  };
                }
    
    render(){
        console.log(this.props.expenseData.expense)
        return(            
            <div className="modal" id={JSON.stringify(this.props.expenseData.expense._id)} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Edit Expense</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form className="form" onSubmit={this.handleSubmit}>
                        <div className="form-group mx-sm-3 mb-2">
                            <input type="text" className="form-control" id={"edittitle"+JSON.stringify(this.props.expenseData.expense._id)} placeholder={this.props.expenseData.expense.title }></input>
                            <input type="text" className="form-control" id={"editcost"+JSON.stringify(this.props.expenseData.expense._id)}  placeholder={"$"+JSON.stringify(this.props.expenseData.expense.cost)}></input>
                            <input type="text" className="form-control" id={"editpeopleName"+JSON.stringify(this.props.expenseData.expense._id)}  placeholder={this.props.expenseData.expense.people}></input>
                            <input type="text" className="form-control" id={"editpaidBy"+JSON.stringify(this.props.expenseData.expense._id)}  placeholder={this.props.expenseData.expense.paidBy}></input>                            
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

export default EditExpense;