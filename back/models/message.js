// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model, adjust if needed
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model, adjust if needed
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    voice: { type: String }, // URL or path to the voice message

});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
