const path = require('path');
const methodOverride = require('method-override');
const { v4: uuid } = require('uuid');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Transaction = require('./models/transaction');

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

app.get('/transactions/:id/edit', (req, res) => {
    const { id } = req.params;
    const transaction = transactions.find( t => t.id === id);
    res.render('transactions/edit', { transaction })
})




app.patch('/transactions/:id', (req, res) => {
    const { id } = req.params;
    const foundTransaction = transactions.find(t => t.id === id);
    const newItem = req.body.item;
    const newCost = req.body.cost;
    
    foundTransaction.item = newItem;
    foundTransaction.cost = newCost;
    

    res.redirect('/transactions')

})

app.delete('/transactions/:id', (req, res) => {
    const { id } = req.params;
    transactions = transactions.filter(t => t.id !== id);
    res.redirect('/transactions')
})




app.listen(3000, () => {
    console.log('Serving on port 3000');
})