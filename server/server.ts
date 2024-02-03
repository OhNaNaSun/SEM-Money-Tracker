import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import Expense from './models/expense' // Adjust the import path as needed
import dotenv from 'dotenv'
dotenv.config()

import { Socket } from 'socket.io'
const app: express.Application = express()
const server: http.Server = http.createServer(app)
app.use(express.json())
mongoose
    .connect(process.env.MONGODB_URI || '')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err))

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
})

app.use(cors())

app.post('/expenses', async (req, res) => {
    try {
        console.log(req.body)
        const expense = new Expense({
            category: req.body.category,
            amount: req.body.amount,
            date: req.body.date,
        })

        const savedExpense = await expense.save()
        io.emit('expense-added', savedExpense)
        res.status(201).json(savedExpense)
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            // Now TypeScript knows `error` is an instance of `Error`
            res.status(400).json({ message: error.message })
        } else {
            // Handle the case where the error is not an instance of `Error`
            res.status(500).json({ message: 'An unknown error occurred' })
        }
    }
})

// Get all Expenses
app.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find()
        res.json(expenses)
    } catch (error) {
        const typedError = error as Error // Type assertion
        res.status(500).json({ message: typedError.message })
    }
})

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello, world! This is an Express route.')
})
// app.post('/expenses', (req: express.Request, res: express.Response) => {

io.on('connection', (socket: Socket) => {
    console.log('A user connected')

    socket.emit('welcome', 'Welcome to the WebSocket server!')

    socket.on('message', (data: string) => {
        console.log(data)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})

const PORT: string | number = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
