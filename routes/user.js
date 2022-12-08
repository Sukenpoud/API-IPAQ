const express = require('express');
const router = express.Router();

// import Middlewares
const loggerMdl = require('../middlewares/logger');
const authMdl = require('../middlewares/auth');

// import Controllers
const userCtrl = require('../controllers/user');

// routes disponibles (CRUD)
router.get('/', [authMdl, loggerMdl], userCtrl.getUserList);
router.get('/:id', [authMdl, loggerMdl], userCtrl.getOneUser);
router.post('/signup', [loggerMdl], userCtrl.createUser);
router.post('/login', [loggerMdl], userCtrl.login);
router.put('/:id', [loggerMdl], userCtrl.updateUser);
router.delete('/:id', [loggerMdl], userCtrl.deleteUser);

module.exports = router;