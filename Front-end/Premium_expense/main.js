var form = document.getElementById('expense-form');
const tableBody = document.getElementById('expenses-table').getElementsByTagName('tbody')[0];
let income = [];
let expense = [];
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const row = document.createElement('tr');

    ['date', 'description', 'income', 'expense'].forEach(function(field) {
        const cell = document.createElement('td');
        cell.textContent = document.getElementById(field).value;
        row.appendChild(cell);
    });

    tableBody.appendChild(row);
    console.log(income,expense)

    form.reset();
});


function addIncome(amount) {
    let today = new Date();
    income.push({date: today, amount: amount});
}


function addExpense(amount) {
    let today = new Date();
    expense.push({date: today, amount: amount});
}

function getMonthlyReport() {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();

    let monthlyIncome = income.filter(i => i.date.getMonth() === month && i.date.getFullYear() === year).reduce((a, b) => a + b.amount, 0);
    let monthlyExpense = expense.filter(e => e.date.getMonth() === month && e.date.getFullYear() === year).reduce((a, b) => a + b.amount, 0);

    return {
        income: monthlyIncome,
        expense: monthlyExpense
    };
}

function getYearlyReport() {
    let today = new Date();
    let year = today.getFullYear();

    let yearlyIncome = income.filter(i => i.date.getFullYear() === year).reduce((a, b) => a + b.amount, 0);
    let yearlyExpense = expense.filter(e => e.date.getFullYear() === year).reduce((a, b) => a + b.amount, 0);

    return {
        income: yearlyIncome,
        expense: yearlyExpense
    };
}

getMonthlyReport();
getYearlyReport();
function showMonthlyReport() {
    let report = getMonthlyReport();
    document.getElementById("monthlyIncome").innerText = report.income;
    document.getElementById("monthlyExpense").innerText = report.expense;
}

function showYearlyReport() {
    let report = getYearlyReport();
    document.getElementById("yearlyIncome").innerText = report.income;
    document.getElementById("yearlyExpense").innerText = report.expense;
}