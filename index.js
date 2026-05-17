const path = require('path');
const methodOverride = require('method-override');
const { v4: uuid } = require('uuid');
const express = require('express');
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let transactions = [
    {
        id: uuid(),
        item: 'Coffee',
        cost: 5.45,
        type: 'Deposit'
    }, 
    {
        id: uuid(),
        item: 'instacart',
        cost: 45.53,
        type: 'Deposit'
    },
    {
        id: uuid(),
        item: 'exit game',
        cost: 15.97,
        type: 'Deposit'
    }
]
function getBalance(){
    let balance = 0;

    for (let t of transactions){
        if (t.type === 'Deposit') {
        balance += Number(t.cost);
        } else { 
            balance -= Number(t.cost);
        }
    }
    return balance;
}

app.get('/transactions', (req,res) => {
    const balance = getBalance();
    res.render('transactions/home', { transactions, balance });
})

app.get('/transactions/new', (req, res) => {
    res.render('transactions/new');
})

app.post('/transactions', (req, res) => {
    const {item, cost, type} = req.body;
    transactions.push({ item, cost: parseFloat(cost), id: uuid(), type})
    res.redirect('/transactions');
})



app.listen(3000, () => {
    console.log('Serving on port 3000');
})