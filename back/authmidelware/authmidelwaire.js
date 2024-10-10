const jwt = require('jsonwebtoken');
const User = require('../models/userodel'); // Assurez-vous que le chemin est correct
const User_google = require('../models/usergooglr'); // Assurez-vous que le chemin est correct

const authMiddleware = async (req, res, next) => {
  let token;

  // Vérifiez si le token est dans l'en-tête Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]; // Extraire le token

    try {
      if (token) {
        // Vérifiez le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        
        // Trouvez l'utilisateur correspondant au token
        const foundUser = await User.findById(decoded.id).select('-password'); // Exclure le mot de passe des données utilisateur
        const foundUser1 = await User_google.findById(decoded.id).select('-password'); // Exclure le mot de passe des données utilisateur

        // Vérifiez si un utilisateur est trouvé dans l'une des collections
        if (!foundUser && !foundUser1) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Attachez l'utilisateur trouvé à req.user
        req.user = foundUser || foundUser1;
        next(); // Passez au prochain middleware ou contrôleur
      } else {
        res.status(401).json({ message: 'No token provided' });
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Authorization header not provided' });
  }
};


const authMiddleware2 = async (req, res, next) => {
  let token;

  // Vérifiez si le token est dans l'en-tête Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]; // Extraire le token

    try {
      if (token) {
        // Vérifiez le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

        // Trouvez l'utilisateur correspondant au token
        const foundUser = await User_google.findById(decoded.id).select('-password'); // Exclure le mot de passe des données utilisateur

        if (!foundUser) {
          return res.status(404).json({ message: 'User not found' });
        }

        req.user = foundUser; // Attachez l'utilisateur trouvé à req.user
        next(); // Passez au prochain middleware ou contrôleur
      } else {
        res.status(401).json({ message: 'No token provided' });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Authorization header not provided' });
  }
};

authMiddleware3 = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }

  try {
      const decoded = jwt.verify(token, 'YOUR_SECRET_KEY'); // Assure-toi que la clé secrète est correcte
      req.user = await User.findById(decoded.userId);
      if (!req.user) {
          return res.status(401).json({ message: 'User not found' });
      }
      req.userId = decoded.userId; // Assure-toi que userId est bien attaché à req
      next();
  } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
  }
};
module.exports = { authMiddleware,authMiddleware2,authMiddleware3 };
