const path = require('path')
const methodOverride = require('method-override');
const { v4: uuid } = require('uuid');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Transaction = require('./Models/transaction');
const Category = require('./Models/categories');
const transactionRoutes = require('./routes/transactions');
const analysisRoutes = require('./routes/analysis');
const budgetRoutes = require('./routes/budgets');
const settingsRoutes = require('./routes/settings');

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
app.use(express.static(path.join(__dirname, 'public')));
app.use('/transactions', transactionRoutes);
app.use('/analysis', analysisRoutes );
app.use('/budgets', budgetRoutes);
app.use('/settings', settingsRoutes);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');






//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------Budget----------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.listen(3000, () => {
    console.log('Serving on port 3000');
})