const User = require('../models/User');
const { createInitialTree } = require('../services/treeService');

async function listUsers(req, res, next) {
  try {
    const users = await User.find({}, { username: 1 }).sort({ username: 1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function loginOrCreate(req, res, next) {
  try {
    const username = String(req.body.username || '').trim();

    if (!username) {
      return res.status(400).json({ message: 'Le nom utilisateur est obligatoire.' });
    }

    let user = await User.findOne({ username });

    if (!user) {
      user = await User.create({
        username,
        tree: createInitialTree(username)
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    res.json({
      message: 'Utilisateur supprime.',
      deletedUserId: deletedUser._id
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listUsers,
  loginOrCreate,
  deleteUser
};
