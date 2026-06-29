const mongoose = require('mongoose');
const Transaction = require('./Models/transaction');
const Category = require('./Models/categories');

mongoose.connect('mongodb://localhost:27017/financeApp')
.then(() => {
    console.log("Mongo Connection open");
}) 
.catch(err => {
    console.log("Oh no error!!");
    console.log(err)
})

const seedCategories =[
    {
        name: 'Income',
    },

    {
       name: 'Housing'
    },

    {
        name: 'Food'
    },

    {
       name: 'Transportation'
    },
    {
        name: 'Utilities'
    },

    {
       name: 'Insurance'
    },

    {
       name: 'Medical'
    },

    {
       name: 'Debt'
    },
    {
       name: 'Savings'
    },
    {
        name: 'Education'
    },
    {
       name: 'Fun'
    },

    {
      name: 'Household'
    }, 
    {
    name: 'Giving'
    },
    {
       name:  'Misc'
    }

]
Category.insertMany(seedCategories)
.then(res => {
    console.log(res)
})
.catch(e => {
    console.log(e)
})

