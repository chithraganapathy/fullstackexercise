const express = require('express')
const app = express();
const morgan = require('morgan')
const PORT = 3000;

app.use(express.json());
//app.use(morgan('tiny'));
morgan.token('obj', function(req, res) { 
	return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :obj'))


let phone = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
	response.json(phone);
})

app.get('/info', (request, response) => {
	response.send('<p>Phonebook has info for ' +phone.length+ ' people <br>'+ new Date().toLocaleTimeString() +'</p>');
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const entry = phone.find(obj => obj.id === id)
	if(entry)
		response.json(entry);
	else {
		response.status(204).end();
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const ids = phone.map(obj => obj.id)
	if(ids.includes(id)) {
		console.log(ids)
		phone = phone.filter(obj => obj.id !== id)
		response.status(202).end();
	}
	else {
		console.log('id entry not present')
	}

})

app.post('/api/persons', (request, response) => {
	const body = request.body;
	if(!body.name || !body.number) {
		return response.status(400).json({
      		error: 'name/number missing'
    	})
	}
	else if(getNames().includes(body.name))
	{
		return response.status(400).json({
      		error: 'name already exists'
    	})
	}
	const newentry = {
		id: getId(),
		name: body.name,
		number: body.number
	}

	phone.push(newentry);
	response.json(phone);	
})

function getNames() {
	const names = phone.map(obj => obj.name);
	return names
}
function getId() {
	const ids = phone.map(obj => obj.id);
	console.log(Math.max(...ids));
	if(ids.length > 0)
		return Math.max(...ids) + 1
	else
		return 1;
}

app.listen(PORT);
console.log(`Server running on port ${PORT}`)
