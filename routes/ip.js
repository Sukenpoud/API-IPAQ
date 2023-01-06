const express = require('express');
const router = express.Router();

// import Middlewares
const authMdl = require('../middlewares/auth');

// import Controllers
const ipCtrl = require('../controllers/ip');

// routes disponibles (CRUD)
router.get('/all', [authMdl], ipCtrl.getIpList);
router.get('/', [authMdl], ipCtrl.getUserIpList);
router.get('/:id', [authMdl], ipCtrl.getOneIp);
router.put('/:id', [authMdl], ipCtrl.updateIp);
router.delete('/:id', [authMdl], ipCtrl.deleteIp);

router.post('/create', [authMdl], ipCtrl.createIp);

module.exports = router;