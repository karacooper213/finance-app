const path = require('path');
const methodOverride = require('method-override');
const { v4: uuid } = require('uuid');
const express = require('express');
const app = express();
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.get('/transactions', async (req,res) => {
    const transactions = await Transaction.find({})
    res.render('transactions/home', { transactions });
})

app.get('/transactions/new',(req, res) => {
    res.render('transactions/new');
})


app.post('/transactions', async (req, res) => {
    req.body.regret = (req.body.regret === 'on');
    const newTransaction = new Transaction(req.body)
    await newTransaction.save();
    console.log(newTransaction);
    res.redirect('/transactions')
   
})


app.get('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
    res.render('transactions/show', {transaction})
})

app.get('/transactions/:id/edit', async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
    res.render('transactions/edit', { transaction })
})




app.put('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    req.body.regret = req.body.regret === 'on'
    await Transaction.findByIdAndUpdate(id, req.body, { runValidators: true, new: true});
    console.log(req.body);
    res.redirect('/transactions')

})

app.delete('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    res.redirect('/transactions')
})

//---------------------------------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------Analysis-----------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------------------//

app.get('/analysis', async (req, res) => {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() -4, 1);
    const labels = ['Housing', 'Food', 'Transportation', 'Utilities', 'Insurance', 'Medical & Healthcare', 'Debt', 'Savings', 'Education', 'Fun', 'Household Supplies', 'Giving', 'Misc'];
    const totals = [];
    const regretRates = [];

    let totalIncome = 0;
    const income = await Transaction.find({
        transactionType: 'Deposit',
        date: {
            $gte: threeMonthsAgo,
            $lt: startOfCurrentMonth
        }
    })

    for (let i in income) {
        totalIncome += income[i].amount;
    }

    let totalSpending = 0;
    const spending = await Transaction.find({
        transactionType: 'Withdraw',
        date: {
            $gte: threeMonthsAgo,
            $lt: startOfCurrentMonth
        }
    })

    for (let s in spending) {
        totalSpending += spending[s].amount;
    }

    const savings = totalIncome - totalSpending;
    const netSavings = savings.toFixed(2);

    let regretSpending = 0;
    const regret = await Transaction.find({
        regret: true,
        date: {
            $gte: threeMonthsAgo,
            $lt: startOfCurrentMonth
        }
    })

    for (let r in regret){
        regretSpending += regret[r].amount;
    }

    const regretRate = regretSpending/totalSpending * 100;
    const regretRateRounded = regretRate.toFixed(2);

 //-------------------------------------------Calculate Totals for each category-----------------------------------------------------------------//

    // total for 

    for (let i =0; i<labels.length; i++) {
        let categorySpending = 0;
        const catSpend = await Transaction.find({
            category: labels[i],
            transactionType: 'Withdraw',
            date: {
                $gte: threeMonthsAgo,
                $lt: startOfCurrentMonth
            }

        })

        for (let c in catSpend){
            categorySpending += catSpend[c].amount;
        }
       
        totals.push(categorySpending);
    }

    //------------------------------------Calculate Regret Rates for each category-------------------------------------------------------------------//
      for (let i =0; i<labels.length; i++) {
        let categoryRegretRate = 0;
        const regretSpend = await Transaction.find({
            category: labels[i],
            transactionType: 'Withdraw',
            date: {
                $gte: threeMonthsAgo,
                $lt: startOfCurrentMonth
            },
            regret: true
        })

        for (let r in regretSpend){
            categoryRegretRate += regretSpend[r].amount;
        }

        const catRegretRate = categoryRegretRate/totals[i];
        const catRegretRateRounded = catRegretRate.toFixed(2);
       
        regretRates.push(catRegretRateRounded * 100);

    }

    res.render('analysis/home', { totalIncome, totalSpending, netSavings, regretRateRounded, labels, totals, regretRates })
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})