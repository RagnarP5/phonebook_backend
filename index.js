// const express = require('express')
require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
// const cors = require('cors')
// const bodyParser = require("body-parser");
// app.use(cors())
app.use(express.json())
app.use(express.static('build'))


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
//
app.get('/', (request, response) => {
    response.send("<h1>Hello World!</h1>")
})
//
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})
//
app.get('/info', (request, response) => {
    const personsLength = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${personsLength}</p>
            <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(persons.map(p => p.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined){
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (body.number === undefined){
        return response.status(400).json({
            error: 'number missing missing'
        })
    }
    // if (persons.map(p => p.name).includes(body.name)){
    //     return response.status(400).json({
    //         error: 'name already exists in phonebook'
    //     })
    // }
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        console.log(savedPerson)
        response.json(savedPerson)
    })
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(404).send({error: 'malformatted id'})
    }
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})