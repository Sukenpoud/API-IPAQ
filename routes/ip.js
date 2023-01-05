const express = require('express');
const router = express.Router();

// import Middlewares
const authMdl = require('../middlewares/auth');

// import Controllers
const ipCtrl = require('../controllers/ip');

// routes disponibles (CRUD)
router.get('/', [], ipCtrl.getIpList);
router.get('/:id', [], ipCtrl.getOneIp);
router.post('/', [], ipCtrl.createIp);
router.put('/:id', [], ipCtrl.updateIp);
router.delete('/:id', [], ipCtrl.deleteIp);

router.post('/create', ipCtrl.insertIp);

module.exports = router;