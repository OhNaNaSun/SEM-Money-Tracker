import { useAppSelector } from '../../app/hooks'
import { getExpenses } from './moneyTrackerSlice'

export function MoneyTracker() {
    const expenses = useAppSelector(getExpenses)
    const categoryName = expenses.map((expense) => expense.category)
    const categories = [...new Set(categoryName)]

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
                    {categories.map((category, index) => {
                        const sum = expenses.reduce((acc, expense) => {
                            if (expense.category === category) {
                                acc += Number(expense.amount)
                            }
                            return acc
                        }, 0)
                        return (
                            <tr key={index}>
                                <td>{category}</td>
                                <td>${sum}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}
