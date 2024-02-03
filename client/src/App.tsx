import React, { useEffect, useState } from 'react'
import './App.css'
import { MoneyTracker } from './features/moneyTracker/MoneyTracker'
import { Expenses } from './features/moneyTracker/Expenses'
import { Button } from './components/Button'
import {
    addExpense,
    fetchExpenses,
} from './features/moneyTracker/moneyTrackerSlice'
import { RootState } from './app/store'
import socket from './socket' // Import the socket instance

import { useAppDispatch, useAppSelector } from './app/hooks'
function App() {
    const [isAdding, setIsAdding] = useState(false)
    const dispatch = useAppDispatch()
    const loading =
        useAppSelector((state: RootState) => state.expenses.status) ===
        'loading'
    useEffect(() => {
        dispatch(fetchExpenses())
    }, [dispatch])

    useEffect(() => {
        socket.on('expense-added', (newExpense) => {
            dispatch(addExpense(newExpense)) // Dispatch action to add expense to the store
        })

        // Cleanup on unmount
        return () => {
            socket.off('expense-added')
        }
    }, [dispatch])
    if (loading) return <div>Loading...</div>
    return (
        <div className="App">
            {!isAdding ? (
                <>
                    <header className="app-header">
                        <span></span>
                        <span>Money Tracker</span>
                        <span></span>
                    </header>

                    <div className="app-content">
                        <MoneyTracker />
                        <Button
                            primary
                            label="Add Expenses"
                            onClick={() => {
                                setIsAdding(true)
                            }}
                        />
                    </div>
                </>
            ) : (
                <>
                    <header className="app-header">
                        {' '}
                        <span
                            className="back-button"
                            onClick={() => {
                                setIsAdding(false)
                            }}
                        >
                            {' '}
                            {`<`}{' '}
                        </span>
                        Expenses
                        <span></span>
                    </header>
                    <div className="app-content">
                        <Expenses />
                    </div>
                </>
            )}
        </div>
    )
}

export default App
