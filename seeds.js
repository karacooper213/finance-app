const mongoose = require('mongoose');
const Transaction = require('./Models/transaction');

mongoose.connect('mongodb://localhost:27017/financeApp')
.then(() => {
    console.log("Mongo Connection open");
}) 
.catch(err => {
    console.log("Oh no error!!");
    console.log(err)
})


const t = new Transaction ({
    item: 'Latte',
    amount: 5.63,
    transactionType: 'withdrawal',
    category: 'Food',
    date: new Date('2026-06-01'),
    vendor: 'Starbucks',
    regret: true

})
t.save().then(t => {
    console.log(t)
})
.catch(e => {
    console.log(t)
}) 

const seedTransactions = [
    {
        item: 'Car Battery',
        amount: 289,
        transactionType: 'Withdraw',
        category: 'Transportation',
        date: new Date('2026-05-27'),
        vendor: 'Autozone',
        regret: false
    },

    {
        item: 'Paycheck',
        amount: 2000,
        transactionType: 'Deposit',
       
        date: new Date('2026-05-27'),
        vendor: 'Autozone',
        regret: false
    },

     {
        item: 'Rack',
        amount: 189.34,
        transactionType: 'Withdraw',
        category: 'Fun',
        date: new Date('2026-05-27'),
        vendor: 'Home Depot',
        regret: false
    },

    {
        item: 'Paycheck',
        amount: 2000,
        transactionType: 'Deposit',
       
        date: new Date('2026-05-27'),
        vendor: 'Autozone',
        regret: false
    },
]

Transaction.insertMany(seedTransactions)
.then(res => {
    console.log(res)
})
.catch(e => {
    console.log(e)
})