const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const subscriberSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
    },
});

module.exports = mongoose.model('Subscriber', subscriberSchema);