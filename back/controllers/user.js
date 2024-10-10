const User = require('../models/userodel');
const User_google = require('../models/usergooglr');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.registerUser = async (req, res) => {
  const { username, email, password,image } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      image
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    res.json(user)
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

exports.getauser = async (req, res) => {
  const { id } = req.user;
  
  try {
    const user = await User.findById(id); // Fetch the user from the main collection
    const user_google = await User_google.findById(id); // Fetch the user from Google collection

    // If one or both users are not found, handle accordingly
    if (!user && !user_google) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Concatenate the results if both users are found
    const allUsers = [user, user_google].filter(Boolean); // Filter out any null or undefined values

    res.json({ allUsers });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getauserid = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the user from the main collection
    const user = await User.findById(id);

    // Fetch the user from the Google collection
    const user_google = await User_google.findById(id);

    // If neither user is found, send a 404 response
    if (!user && !user_google) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Concatenate the results, filtering out any null or undefined values
    const allUsers = [user, user_google].filter(Boolean);

    res.json({ allUsers });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Assuming user is authenticated and ID is available in req.user
    const userId = req.user._id;

    // Update user's image field
    const imageUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(userId, { image: imageUrl });

    res.json({ imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};