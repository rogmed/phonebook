const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json());
app.use(express.static('dist'));

// LOG FORMAT
app.use(
    morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            (tokens.method(req, res) === 'POST' ? JSON.stringify(req.body) : '')
        ].join(' ')
    }));
app.use(cors());

// INFO PAGE
app.get('/info', (request, response) => {
    const date = new Date();
    Person.find({}).then(persons => {
        response.send(
            `<p>Phonebook has info for ${persons.length} people.</p>
            <p>${date}</p>`
        );
    })
});

const apiUrl = "/api/persons";

// GET ALL
app.get(apiUrl, (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    })
});

// GET BY ID
app.get(`${apiUrl}/:id`, (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => {
            console.log('error.message :>> ', error.message);
            response.status(422).end();
        });
});

// DELETE BY ID
app.delete(`${apiUrl}/:id`, (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            console.log(result);
            console.log('no se borra???');
            response.status(204).end();
        });
});

// POST
app.post(apiUrl, (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(422).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        response.json(savedPerson);
    });
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
