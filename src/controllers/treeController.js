const User = require('../models/User');
const {
  cloneTree,
  ensureTreeShape,
  addPartner,
  addChild,
  updatePerson,
  deleteFamilyBranch,
  removePartner
} = require('../services/treeService');

async function getUserById(userId) {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('Utilisateur introuvable.');
    error.status = 404;
    throw error;
  }

  return user;
}

async function getTree(req, res, next) {
  try {
    const user = await getUserById(req.params.userId);
    res.json(user.tree);
  } catch (error) {
    next(error);
  }
}

async function replaceTree(req, res, next) {
  try {
    const user = await getUserById(req.params.userId);
    user.tree = ensureTreeShape(req.body.tree);
    await user.save();
    res.json(user.tree);
  } catch (error) {
    next(error);
  }
}

async function addPartnerToFamily(req, res, next) {
  try {
    const user = await getUserById(req.params.userId);
    const tree = cloneTree(user.tree);
    addPartner(tree, req.params.familyId, req.body.name);
    user.tree = tree;
    await user.save();
    res.json(user.tree);
  } catch (error) {
    next(error);
  }
}

async function addChildToFamily(req, res, next) {
  try {
    const user = await getUserById(req.params.userId);
    const tree = cloneTree(user.tree);
    addChild(tree, req.params.familyId, req.body.name);
    user.tree = tree;
    await user.save();
    res.json(user.tree);
  } catch (error) {
    next(error);
  }
}

async function renamePerson(req, res, next) {
  try {
    const user = await getUserById(req.params.userId);
    const tree = cloneTree(user.tree);
    updatePerson(tree, req.params.personId, req.body.name);
    user.tree = tree;
    await user.save();
    res.json(user.tree);
  } catch (error) {
    next(error);
  }
}

async function deleteBranch(req, res, next) {
  try {
    const user = await getUserById(req.params.userId);
    const tree = cloneTree(user.tree);
    deleteFamilyBranch(tree, req.params.familyId);
    user.tree = tree;
    await user.save();
    res.json(user.tree);
  } catch (error) {
    next(error);
  }
}

async function deletePartner(req, res, next) {
  try {
    const user = await getUserById(req.params.userId);
    const tree = cloneTree(user.tree);
    removePartner(tree, req.params.familyId);
    user.tree = tree;
    await user.save();
    res.json(user.tree);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTree,
  replaceTree,
  addPartnerToFamily,
  addChildToFamily,
  renamePerson,
  deleteBranch,
  deletePartner
};
