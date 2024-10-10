// controllers/messageController.js
const Message = require('../models/message');
const path = require('path');
const fs = require('fs');
exports.getAllMessages = async (req, res) => {
    const { receiverId } = req.params;  // ID du destinataire depuis l'URL
    const { id } = req.user;  // ID de l'utilisateur authentifié

    try {
        // Trouve tous les messages entre l'expéditeur et le destinataire, triés par timestamp décroissant
        const messages = await Message.find({
            $or: [
                { sender: id, receiver: receiverId },
                { sender: receiverId, receiver: id }
            ]
        })
        .sort({ timestamp: 1 });  // -1 pour décroissant, 1 pour croissant

        res.json(messages);
    } catch (err) {
        res.status(500).send(err);
    }
};

// controllers/messageController.js
// controllers/messageController.js
exports.createMessage = async (req, res) => {
    const { text } = req.body;
    const { receiverId } = req.params;  // ID du destinataire depuis l'URL
    const { id } = req.user;  // ID de l'utilisateur authentifié

    if (!id || !receiverId) {
        return res.status(400).json({ error: "User ID or Receiver ID is missing" });
    }

    try {
        const message = new Message({ sender: id, receiver: receiverId, text });
        await message.save();
        res.status(201).json(message);
    } catch (err) {
        res.status(500).send(err);
    }
};
exports.sendVoiceMessage = async (req, res) => {
    try {
      const { sender, receiver } = req.body;
      const voice = req.file.path; // Chemin vers le fichier vocal
      const message = new Message({ sender, receiver, voice });
      await message.save();
      res.status(201).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  