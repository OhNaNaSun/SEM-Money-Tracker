import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

interface ExpenseState {
    amount: string
    category: string
    date: string
}
export interface ExpensesState {
    value: ExpenseState[]
    status: 'idle' | 'loading' | 'failed' | 'succeeded'
    error?: string | undefined
}

const initialState: ExpensesState = {
    value: [
        {
            amount: '100',
            category: 'Food',
            date: '2021-10-01',
        },
    ],
    status: 'idle',
}

// Async thunk for fetching expenses
export const fetchExpenses = createAsyncThunk(
    'expenses/fetchExpenses',
    async () => {
        const response = await fetch('http://localhost:8080/expenses')
        if (!response.ok) {
            throw new Error('Failed to fetch expenses')
        }
        const data = await response.json()
        return data
    }
)

// Async thunk for adding an expense
export const addExpenseAsync = createAsyncThunk(
    'expenses/addExpenseAsync',
    async (expenseData: ExpenseState, thunkAPI) => {
        const response = await fetch('http://localhost:8080/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
        })
        const data = await response.json()
        return data // This will be the payload for the fulfilled action
    }
)
export const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        addExpense: (state, action: PayloadAction<ExpenseState>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            console.log('addding')
            state.value.push(action.payload)
            // state.value = [...state.value, action.payload]
        },
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder
            .addCase(addExpenseAsync.pending, (state, action) => {
                // Optionally, handle the pending state
            })
            .addCase(addExpenseAsync.fulfilled, (state, action) => {
                // When the async operation is successful, update the state
                // For example, add the new expense to your state array
                state.value.push(action.payload)
            })
            .addCase(addExpenseAsync.rejected, (state, action) => {
                // Optionally, handle the error state
            })
            // Handling fetchExpenses
            .addCase(fetchExpenses.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.value = action.payload
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    },
})

export const { addExpense } = expenseSlice.actions

export const getExpenses = (state: RootState) => state.expenses.value

export default expenseSlice.reducer