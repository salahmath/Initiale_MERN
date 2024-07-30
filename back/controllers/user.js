const User = require('../models/userodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

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

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

exports.getauser = async (req, res) => {
  const { id } = req.user;
  try {
    const User = await User.findById(id);
    res.json({ User });
  } catch(err) {
    res.status(500).json({ message: 'Aucun utilisateur trouvé' });
  }
};

exports.facebook = async (req, res) => {
  try {
    const { userId, accessToken } = req.body;

    if (!userId || userId === '' || !accessToken || accessToken === '') {
      return res.status(400).json({ message: "userId and accessToken are required" });
    }

    let { data } = await getUserByFacebookIdAndAccessToken(accessToken, userId);
    let user = await User.findOne({ facebookId: data.id });
    let authObject = {};

    if (user) {
      let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '20h' });
      authObject = { auth: true, token, user, message: "Successfully logged in." };
      return res.status(201).json(authObject);
    } else {
      user = await User.create({
        name: data.name,
        email: data.email,
        facebookId: data.id
      });
      let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '20h' });
      authObject = { auth: true, token, user, message: "Successfully Registered." };
      return res.status(201).json(authObject);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// Fonction pour obtenir les informations de l'utilisateur Facebook
const getUserByFacebookIdAndAccessToken = (accessToken, userId) => {
  let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userId}?fields=id,name,email&access_token=${accessToken}`;
  return axios.get(urlGraphFacebook);
};
