const express = require('express');
const router = express.Router();

// import Middlewares
const authMdl = require('../middlewares/auth');

// import Controllers
const userCtrl = require('../controllers/user');

// routes disponibles (CRUD)
router.get('/', [authMdl], userCtrl.getUserList);
router.get('/:id', [authMdl], userCtrl.getOneUser);
router.post('/signup', [], userCtrl.createUser);
router.post('/login', [], userCtrl.login);
router.put('/:id', [], userCtrl.updateUser);
router.delete('/:id', [], userCtrl.deleteUser);

module.exports = router;