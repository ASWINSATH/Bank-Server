//server creation
//1. import express

const express = require('express')
//import jsonwebtoken

const jwt = require('jsonwebtoken')

// import dataservice

const dataService = require('./service/data.service')

// import CORS 

const cors = require('cors')

//2. create an app using express

const app = express()

// give command to share data via cors

app.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json from req body

app.use(express.json())

//4. resolving HTTP request

//GET request - Read data
app.get('/', (req, res) => {
    res.send('GET METHOD')
})

//POST request data
app.post('/', (req, res) => {
    res.send('POST METHOD')
})

//PUT request - TO Completely modify data
app.put('/', (req, res) => {
    res.send('PUT METHOD')
})

//PATCH request - to partially modify data
app.patch('/', (req, res) => {
    res.send('PATCH METHOD')
})

//DELETE request -
app.delete('/', (req, res) => {
    res.send('DELETE METHOD')
})

//jwtmiddleware - to validate token

const jwtmiddleware = (req, res, next) => {
    try {
        console.log("Router specific middleware");
        const token = req.headers['x-access-token']

        //validate - verify()

        const data = jwt.verify(token, 'supersecretkey12345')
        console.log(data);
        next()
    }
    catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: 'please Log in'
        })
    }
}

//login API
app.post('/login', (req, res) => {
    console.log(req.body);
     dataService.login(req.body.acno, req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })
})

//register API - post
app.post('/register', (req, res) => {
    console.log(req.body);
     dataService.register(req.body.acno, req.body.password, req.body.username)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })
})

//deposit
app.post('/deposit',jwtmiddleware, (req, res) => {
    console.log(req.body);
    dataService.deposit(req.body.acno, req.body.pswd, req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })
})

//withdraw
app.post('/withdraw', (req, res) => {
    console.log(req.body);
    dataService.withdraw(req.body.acno, req.body.pswd, req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })
})

//transaction history

app.post('/transaction', (req, res) => {
    console.log(req.body);
    dataService.getTranscation(req.body.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })
})

//delete

//3. create port number

app.listen(3001, () => {
    console.log('server started at port number:3001');
})