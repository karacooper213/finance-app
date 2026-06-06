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
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() -3)
    let totalIncome = 0;
    const income = await Transaction.find({
        transactionType: 'Deposit',
        date: {
            $gte: threeMonthsAgo
        }
    })

    for (let i in income) {
        totalIncome += income[i].amount;
    }

    res.render('analysis/home', { totalIncome })
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})