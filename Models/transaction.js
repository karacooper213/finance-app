const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    transactionType: {
        type: String,
        enum: ['Deposit', 'Withdraw'],
        required: true
    },

    category: {
        type: String,
        enum: ['Housing', 'Food', 'Transportation', 'Utilities', 'Insurance', 'Medical & Healthcare', 'Debt', 'Savings', 'Education', 'Fun', 'Household Supplies', 'Giving', 'Misc'],
        required: false
    },

    date: {
        type: Date,
        required: true
    }, 

    vendor: {
        type: String,
        required: true
    }, 

    regret: {
        type: Boolean,
        default: false
    }
    
})

    const Transaction = mongoose.model('Transaction', transactionSchema);

    module.exports = Transaction;






