const User = require('../models/userodel');
const User_google = require('../models/usergooglr');

exports.GetAllusers = async (req, res) => {
  try {
    // Récupération des utilisateurs de deux sources
    const users = await User.find();
    const users_google = await User_google.find();

    // Concaténation des résultats
    const allUsers = users.concat(users_google);

    // Réponse avec tous les utilisateurs
    res.json(allUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
