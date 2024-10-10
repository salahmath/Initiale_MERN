const Amis = require('../models/freind'); // Adjust the path to your Amis model
const User = require('../models/userodel');
const User_google = require('../models/usergooglr');
exports.toggleFriendStatus = async (req, res) => {
  const { friendId } = req.body; // Assuming friendId is sent in the request body
  const { id } = req.user; // Assuming user ID is available in req.user

  try {
    // Find the existing relationship
    let amisEntry = await Amis.findOne({ user: id, freind: friendId });

    if (amisEntry) {
      // If an entry exists, toggle the `amis` status
      amisEntry.amis = !amisEntry.amis; // Ensure amis is treated as a boolean
      await amisEntry.save();
    } else {
      // If no entry exists, create a new one with `amis` set to true
      amisEntry = new Amis({
        user: id,
        freind: friendId,
        amis: true // Initializing as true for a new friend relationship
      });
      await amisEntry.save();
    }

    res.json({ amisEntry });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.Liste_freinds = async (req, res) => {
    const { id } = req.user;

    try {
        // Retrieve Amis documents with populated friend details
        const amis = await Amis.find({ user: id, amis: true }).populate('freind');

        // Return the amis and the populated friend details
        res.json(amis);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.Liste_infreinds = async (req, res) => {
  const { id } = req.user;

  try {
    // Retrieve all users
    const allUsers = await User.find();

    // Retrieve Amis documents with populated friend details
    const amis = await Amis.find({ user: id, amis: true }).populate('freind');

    // Extract friend IDs
    const friendIds = amis.map(ami => ami.freind._id.toString());

    // Filter users to get those who are not friends
    const nonFriends = allUsers.filter(user => !friendIds.includes(user._id.toString()) && user._id.toString() !== id);

    // Return the non-friends list
    res.json(nonFriends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
