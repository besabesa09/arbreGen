const express = require('express');
const { listUsers, loginOrCreate, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', listUsers);
router.post('/login', loginOrCreate);
router.delete('/:userId', deleteUser);

module.exports = router;
