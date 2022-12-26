var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/splitwise')

var Event = require('./models/event');
var Expense = require('./models/expense');

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//create an event with uniqueId, title, people
app.post('/event', function(request, response) {   
    var event = new Event();
    console.log(request.body)
    event.title = request.body.title;
    event.people = request.body.people;
    event.uniqueId =request.body.uniqueId;
    event.save(function(err, savedEvent) {
       if (err) {
           response.status(500).send({error:"Could not create event"});
       } else {
            console.log(request.body)
            console.log(savedEvent)
           response.status(200).send(savedEvent);
       }
    });
});


//fetch all events
app.post('/event/all', function (req, res) {
    Event.find({}, function (err, fetchedevents) {
        if (err) {
            res.status(500).send({
                error: "Couldn't fetch events"
            });

        } else {
            res.status(200).send(fetchedevents);            
        }
    });
});

//find a specific event
app.post('/event/find', function (req, res) {
    Event.findOne({uniqueId: req.body.eventId}, function (err, fetchedevent) {
        if (err) {
            res.status(500).send({
                error: "Couldn't fetch event"
            });

        } else {         
            res.status(200).send(fetchedevent)            
        }
    });
});


//update an event's title and add/remove people
app.put('/event', function(request, response) {
   Event.findOne({uniqueId: request.body.uniqueId}, function(err, fetchedproduct) {
       if (err | fetchedproduct === null) {
           response.status(500).send({error:"Can't find event"});
       } else {
           Event.update({uniqueId:request.body.uniqueId}, {$set: {title: request.body.title, people: request.body.people}}, function(err, fetchedproduct) {
               if (err) {
                   response.status(500).send({error:"Event update failed"});
               } else {
                   response.status(200).send("Event update successful");
               }
           });
       }
   })
});


//removing a member from an event removes them from all expenses in that event
app.delete('/event/member', function(request, response){
    Event.findOne({uniqueId: request.body.eventId}, function(err, fetchedEvent){
       if (err | fetchedEvent === null) {
           response.status(500).send({error:"Event doesn't exist"});
       }else{
            Expense.find({eventId: fetchedEvent._id}, function (err, fetchedExpenses) {
                if (err) {
                    response.status(500).send({
                        error: "Couldn't fetch expenses"
                    });

                } else {
                    for(j=0; j<fetchedExpenses.length; j++){
                        for (i = 0; i<fetchedExpenses[j].people.length; i++) {
                            person = fetchedExpenses[j].people[i];                
                            if (person === request.body.removeMember) { 
                                fetchedExpenses[j].people.splice(i, 1);
                                fetchedExpenses[j].save();
                                }           
                        }      
                    }                  
                }
            }); 
           for (i = 0; i<fetchedEvent.people.length; i++) {
                person = fetchedEvent.people[i];                
                if (person === request.body.removeMember) { 
                    fetchedEvent.people.splice(i, 1);
                    fetchedEvent.save();
                }           
            }
            console.log(fetchedEvent)
           response.status(200).send("Succesfully removed member")

       }
    });
});


//create an expense under an event. only add people that are included in that event
app.post('/expense', function(request, response) {
    var expense = new Expense();
    Event.findOne({uniqueId: request.body.eventId}, function(err, event){
       if (err | event === null) {
           response.status(500).send({error:"Event doesn't exist"});
       }else{
            expense.eventId = event._id;
            expense.title = request.body.title;
            expense.cost = request.body.cost;
            expense.paidBy = request.body.paidBy;
           
            
            if (checker(event.people,request.body.people)){
                expense.people = request.body.people;
            }
           else{
              response.status(300).send({error:"Person not added to event"});
          }
           
            expense.save(function(err, savedExpense) {
               if (err) {
                   response.status(500).send({error:"Could not create expense"});
               } else {
                    console.log(request.body)
                    console.log(savedExpense)
                    response.status(200).send(savedExpense);
               }
            });
        }
    }); 
});


//fetch all expenses of an event
app.post('/expense/all', function (req, res) {
    Event.findOne({uniqueId: req.body.eventId}, function (err, fetchedevent) {
        if (err) {
            res.status(500).send({
                error: "Couldn't fetch event"
            });

        } else {         
            console.log(req.body)
            console.log(fetchedevent)     
            Expense.find({eventId: fetchedevent._id}, function (err, fetchedexpenses) {
                if (err) {
                    res.status(500).send({
                        error: "Couldn't fetch expenses"
                    });

                } else {
                    res.status(200).send(fetchedexpenses);            
                }
            });              
        }
    });
});


//update expense title/cost/people. all people must be included in event
app.put('/expense', function(request, response) {
   Event.findOne({_id: request.body.eventId}, function(err, fetchedevent) {
       if (err | fetchedevent === null) {
           response.status(500).send({error:"Couldn't find event"});
       } 
       else {     
           if (checker(fetchedevent.people,request.body.people)){
               Expense.updateOne({_id:request.body.expenseId}, {$set: {title: request.body.title, cost: request.body.cost, people: request.body.people, paidBy: request.body.paidBy}}, function(err, fetchedexpense) {
               if (err | fetchedexpense === null) {
                   response.status(500).send({error:"Expense update failed"});
               } 
               else {
                   response.status(200).send("Expense update successful");
               }
           });
            }
           else{
               response.status(300).send({error:"All people not added to event"});
           }
                     
       }
   })
});

//delete an expense
app.delete('/expense/remove', function(request, response){
    Expense.remove({_id: request.body.expenseId}, function (err, fetchedExpenses) {
        if (err) {
            response.status(500).send({error: "Couldn't find expense"});
        } else { 
            response.status(200).send("Succesfully removed expense")            
        }
    }); 
    });


app.listen(3004, function() {
    console.log("Splitwise API running on port 3004...");
});




//function to check if all items in target are included in arr
let checker = (arr, target) => target.every(v => arr.includes(v));