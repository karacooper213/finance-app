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

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const categories = await Category.findById(id);
    
    res.render('settings', { categories })
})




router.put('/:id', async (req, res) => {
    const { id } = req.params;
   
    await Category.findByIdAndUpdate(id, req.body, { runValidators: true, new: true});
    console.log(req.body);
    res.redirect('/settings')

})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const categories = await Category.findByIdAndDelete(id);
    res.redirect('/settings')
})

module.exports = router;