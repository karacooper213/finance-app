const express = require('express');
const router = express.Router();
const Category = require('../Models/categories');

router.get('/', async (req,res) => {
    const categories = await Category.find({});
    res.render('settings/home', { categories });
})


router.post('/', async (req, res) => {
    const newCategory = new Category(req.body)
    await newCategory.save();
    console.log(newCategory);
    res.redirect('/settings', );
   
})

module.exports = router;