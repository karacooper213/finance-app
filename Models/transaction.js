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
        enum: ['Income', 'Housing', 'Food', 'Transportation', 'Utilities', 'Insurance', 'Medical', 'Debt', 'Savings', 'Education', 'Fun', 'Household', 'Giving', 'Misc'],
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
        default: false,
        required: true
    },

    necessity: {
        type: String,
        enum: ['Need', 'Need (Cheaper Option Available)', 'Want'],
        required: true,
        default: 'Need'
    },
    
})

    const Transaction = mongoose.model('Transaction', transactionSchema);

    module.exports = Transaction;






