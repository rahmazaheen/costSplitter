import 'whatwg-fetch';

class HttpService {
    getExpenses = (id) => {
        var promise = new Promise((resolve, reject) => {
            console.log(JSON.stringify({'eventId': id}))
            fetch('http://localhost:3004/expense/all', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'eventId': id})
            }).then(response => {
                resolve(response.json());
            })
        });
        return promise;
    }
}

export default HttpService;


