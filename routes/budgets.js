const express = require('express');
const router = express.Router();
const Target = require('../Models/targets');

router.get('/', async (req,res) => {
    const targets = await Target.find({});
    res.render('budgets/home', { targets });
})





module.exports = router;