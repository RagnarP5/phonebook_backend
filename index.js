const express = require('express')
const morgan = require('morgan')
const {request, response} = require("express");

const app = express()
morgan.token('type', (request, response) => {
    return request.headers['content-type']
})

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

app.get('/', (request, response) => {
    response.send("<h1>Hello World!</h1>")
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const personsLength = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${personsLength}</p>
            <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person){
        response.json(person)
    } else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(persons.map(p => p.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name){
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number){
        return response.status(400).json({
            error: 'number missing missing'
        })
    }
    if (persons.map(p => p.name).includes(body.name)){
        return response.status(400).json({
            error: 'name already exists in phonebook'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})