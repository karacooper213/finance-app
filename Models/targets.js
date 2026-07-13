const mongoose = require('mongoose');

const targetsSchema = new mongoose.Schema({
      category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },

        date: {
            type: Date,
            required: true
        }, 

        amount: {
            type: Number,
            required: true
        }


});

targetsSchema.index(
    { category: 1, date: 1 },
    { unique: true}
);

module.exports = mongoose.model('Target', targetsSchema);