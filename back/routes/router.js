const express = require('express');
const router = express.Router();
const { registerUser, LoginUser, getauser, facebook, getauserid, Update_freind, uploadImage } = require('../controllers/user');
const { authMiddleware, authMiddleware2 } = require('../authmidelware/authmidelwaire');
const { LoginUser_google, getauser_google } = require('../controllers/user_googlr');

const messageController = require('../controllers/message');
const { GetAllusers } = require('../controllers/Users');
const multer = require('multer');
const path = require('path');
const { toggleFriendStatus, Liste_freinds, Liste_infreinds } = require('../controllers/amis');
const User = require('../models/userodel'); // Ensure User model is imported

// Set up multer for file images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images'); // Directory for images
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
    }
});
const upload = multer({ storage:storage });

// Define routes
router.post('/register', registerUser);
router.post('/login', LoginUser);
router.post('/login_google', LoginUser_google);
router.get('/user', authMiddleware, getauser);
router.get('/user_google', authMiddleware2, getauser_google);

router.get('/messages/:receiverId', authMiddleware, messageController.getAllMessages);
router.post('/messages/:receiverId', authMiddleware, messageController.createMessage);

router.get('/users', GetAllusers);
router.get('/userId/:id', getauserid);

/* router.post('/voice', upload.single('voice'), messageController.sendVoiceMessage);
 */router.post('/addAmis', authMiddleware, toggleFriendStatus);
router.get('/Amis', authMiddleware, Liste_freinds);
router.get('/inAmis', authMiddleware, Liste_infreinds);

// Route for uploading user image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const imageUrl = `/images/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
