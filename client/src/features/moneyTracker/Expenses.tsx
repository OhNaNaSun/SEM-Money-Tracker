import { useState } from 'react'
import { addExpenseAsync, getExpenses } from './moneyTrackerSlice'
import { Button } from '../../components/Button'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
export function Expenses() {
    const expenses = useAppSelector(getExpenses)
    const [amount, setAmount] = useState('0')
    const [category, setCategory] = useState('Bills')
    const dispatch = useAppDispatch()
    return (
        <>
            <div className="app-row">
                <b>Add a new expense:</b>
            </div>
            <div className="app-row">
                <span>Amount:</span>
                <span className="flex">
                    $
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => {
                            let inputValue = parseFloat(e.target.value)

                            // Check if the value is a positive number
                            if (!isNaN(inputValue) && inputValue > 0) {
                                // Format to two decimal places
                                inputValue = +inputValue.toFixed(2)
                            } else {
                                // Clear the input if it's not a valid positive number
                                inputValue = 0
                            }
                            setAmount(String(inputValue))
                        }}
                    />
                </span>
            </div>
            <div className="app-row">
                <span>Category:</span>
                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value)
                    }}
                >
                    <option value="Bills">Bills</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Health">Health</option>
                    <option value="Travel">Travel</option>
                    <option value="Others">Others</option>
                </select>
            </div>

            <div>
                <Button
                    primary
                    label="Confirm"
                    aria-label="Increment value"
                    onClick={() => {
                        if (amount === '0') {
                            alert('Please enter a valid amount')
                            return
                        }
                        const expenseData = {
                            category,
                            amount,
                            date: new Date().toLocaleDateString(),
                        }
                        dispatch(addExpenseAsync(expenseData))
                    }}
                />
            </div>
            <p>Expense history: </p>
            <table className="expense-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense, index) => (
                        <tr key={index}>
                            <td>{expense.category}</td>
                            <td>${expense.amount}</td>
                            <td>{expense.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
