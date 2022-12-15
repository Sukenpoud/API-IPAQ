const express = require('express');
const router = express.Router();

// import Middlewares
const loggerMdl = require('../middlewares/logger');
const authMdl = require('../middlewares/auth');

// import Controllers
const ipCtrl = require('../controllers/ip');

// routes disponibles (CRUD)
router.get('/', [authMdl, loggerMdl], ipCtrl.getIpList);
router.get('/:id', loggerMdl, ipCtrl.getOneIp);
router.post('/', loggerMdl, ipCtrl.createIp);
router.put('/:id', loggerMdl, ipCtrl.updateIp);
router.delete('/:id', loggerMdl, ipCtrl.deleteIp);

module.exports = router;