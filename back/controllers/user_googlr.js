const User_google = require('../models/userodel');
const jwt = require('jsonwebtoken');

exports.LoginUser_google = async (req, res) => {
  const { email, username,image } = req.body;
  
  try {
    // Chercher l'utilisateur dans la base de données
    let user = await User_google.findOne({ email });
    
    // Si l'utilisateur n'existe pas, en créer un nouveau
    if (!user) {
      user = new User_google({
        username,
        email,
        image
      });

      // Sauvegarder le nouvel utilisateur dans la base de données
      await user.save();
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Répondre avec le token et les détails de l'utilisateur
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getauser_google = async (req, res) => {
    const { id } = req.user; // Récupérer l'ID de l'utilisateur à partir de req.user
  try {
    const user = await User_google.findById(id); // Trouver l'utilisateur dans la base de données

    if (!user) {
      return res.status(404).json({ message: 'User not found 2' });
    }

    res.json({ user }); // Répondre avec les détails de l'utilisateur
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};