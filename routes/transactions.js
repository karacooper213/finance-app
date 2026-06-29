const express = require('express');
const router = express.Router();
const Transaction = require('../Models/transaction');
const Category = require('../Models/categories');

router.get('/', async (req,res) => {
    const transactions = await Transaction.find({}).populate('category');
    res.render('transactions/home', { transactions });
})

router.get('/new', async (req, res) => {
    const categories = await Category.find({})
    res.render('transactions/new', { categories });
})


router.post('/', async (req, res) => {
    req.body.regret = (req.body.regret === 'on');
    const newTransaction = new Transaction(req.body)
    await newTransaction.save();
    console.log(newTransaction);
    res.redirect('/transactions')
   
})


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id).populate('category')
    res.render('transactions/show', {transaction})
})

router.get('/:id/edit', async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    const categories = await Category.find({});
    res.render('transactions/edit', { transaction, categories })
})




router.put('/:id', async (req, res) => {
    const { id } = req.params;
    req.body.regret = req.body.regret === 'on'
    await Transaction.findByIdAndUpdate(id, req.body, { runValidators: true, new: true});
    console.log(req.body);
    res.redirect('/transactions')

})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    res.redirect('/transactions')
})

module.exports = router;