import { useAppSelector } from '../../app/hooks'
import { getExpenses } from './moneyTrackerSlice'

export function MoneyTracker() {
    const expenses = useAppSelector(getExpenses)
    return (
        <>
            <p>Expense summary: </p>
            <table className="expense-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense, index) => (
                        <tr key={index}>
                            <td>{expense.category}</td>
                            <td>${expense.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
