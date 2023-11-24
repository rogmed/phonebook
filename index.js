const express = require('express')
const app = express()

app.use(express.json());

let persons = [
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

app.get('/info', (request, response) => {
    const date = new Date();

    response.send(
        `<p>Phonebook has info for ${persons.length} people.</p>
        <p>${date}</p>`
    );
});

const apiUrl = "/api/persons";

app.get(apiUrl, (request, response) => {
    response.json(persons);
});

app.get(`${apiUrl}/:id`, (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete(`${apiUrl}/:id`, (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
});

const generateId = () => {
    const max = 999999999;
    return Math.floor(Math.random() * max);
}

app.post(apiUrl, (request, response) => {
    const body = request.body;
    const name = body.name;
    const number = body.number;

    if (!name || !number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const foundPerson = persons.find(p => p.name.toLowerCase() === name.toLowerCase());

    if (foundPerson) {
        return response.status(422).json({
            error: 'name must be unique (case-insensitive)'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);
    console.log('person saved :>> ', person);
    response.json(person);
});

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
