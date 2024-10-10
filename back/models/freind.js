const mongoose = require('mongoose');

// Assuming you have models named 'User' and 'User_google' defined elsewhere
const AmisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
        required: true
    },
    freind: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model, adjust if needed
        required: true
    },
    amis: {
        type: Boolean,
        default: false
    }
});

const Amis = mongoose.model('Amis', AmisSchema);

module.exports = Amis;
