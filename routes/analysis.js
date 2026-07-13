const express = require('express');
const router = express.Router();
const Transaction = require('../Models/transaction');
const Category = require('../Models/categories');
const Target = require('../Models/targets');

router.get('', async (req, res) => {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() -4, 1);

    const categories = await Category.find({});
    const labels = categories.map(category => category.name);
    const totals = [];
    const regretRates = [];
    const targetRecommendations = [];
    const differences = [];

    const transaction = await Transaction.find({
        date: {
            $gte: threeMonthsAgo,
            $lt: startOfCurrentMonth
        }
    }).populate('category')

    
    // Gets the total earned in the last 90 days (not including the current month)

    let totalIncome = 0;

    for (let t in transaction) {
        if(transaction[t].transactionType === 'Deposit'){
            totalIncome += transaction[t].amount;
        }
    }

    totalIncome = totalIncome.toFixed(2);

    // Gets the total spent in the last 90 days (not including the current month)
    let totalSpending = 0;
    
    for (let t in transaction) {
        if(transaction[t].transactionType === 'Withdraw'){
            totalSpending += transaction[t].amount;
        }
    }


   totalSpending = totalSpending.toFixed(2);



    const savings = totalIncome - totalSpending;
    const netSavings = savings.toFixed(2);



    // Gets the total amount regretted by user and then calulates percentage.
    let regretSpending = 0;
    
    for (let t in transaction) {
        if(transaction[t].regret === true){
            regretSpending += transaction[t].amount;
        }
    }
  
    const regretRate = regretSpending/totalSpending * 100;
    const regretRateRounded = regretRate.toFixed(2);
  


 //-------------------------------------------Calculate Totals for each category-----------------------------------------------------------------//

    // total for 
     
    let spendingWithoutRegret = totalSpending - regretSpending;
    let newNet = totalIncome - spendingWithoutRegret;
    
 

    for (let i =0; i<categories.length; i++) {
        let categorySpending = 0;
        const catSpend = await Transaction.find({
            category: categories[i]._id,
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
        categorySpending = 0;
           if (newNet >= 0){
            for (let cs in catSpend) {
                if(catSpend[cs].regret === false){
                    categorySpending += catSpend[cs].amount;
                }
            }

            } else {
                for (let cs in catSpend) {
                    if(catSpend[cs].regret === false && catSpend[cs].necessity !== "Want") {
                        categorySpending += catSpend[cs].amount;
                    }
                }
            } 
          targetRecommendations.push(categorySpending)
    }

    //------------------------------------Calculate Regret Rates for each category-------------------------------------------------------------------//
      for (let i =0; i<categories.length; i++) {
        let categoryRegretRate = 0;
        const regretSpend = await Transaction.find({
            category: categories[i]._id,
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

    for (let i= 0; i<categories.length; i++){
        let difference = 0;
        difference = targetRecommendations[i] - totals[i];
        differences.push(difference);
    }    

    //----------------------------------------------------push target Recommendations ----------------------------------------------------------------
    
    const targetDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    for (let i =0; i < targetRecommendations.length; i++) {
        const target = await Target.findOneAndUpdate(
            {
            category: categories[i]._id,
            date: targetDate
            },
            {
            amount: targetRecommendations[i],
            },
            {
                upsert:true,
                new: true,
                runValidators: true
            }
        )


    }

    res.render('analysis/home', { totalIncome, totalSpending, netSavings, regretRateRounded, labels, totals, regretRates, targetRecommendations, differences });
})

module.exports = router;