import mongoose, { Document, Schema } from 'mongoose'

interface IExpense extends Document {
    category: string
    amount: string
    date: string
}

const ExpenseSchema: Schema = new Schema({
    category: { type: String, required: true },
    amount: { type: String, required: true },
    date: { type: String, required: true },
})

const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema)
export default Expense
