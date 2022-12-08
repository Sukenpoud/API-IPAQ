const express = require('express');
const router = express.Router();

// import Middlewares
const loggerMdl = require('../middlewares/logger');
const authMdl = require('../middlewares/auth');

// import Controllers
const objectCtrl = require('../controllers/object');

// routes disponibles (CRUD)
router.get('/', [authMdl, loggerMdl], objectCtrl.getObjectList);
router.get('/:id', loggerMdl, objectCtrl.getOneObject); // possible de mettre en série des middlewares en utilisant un array []
router.post('/', loggerMdl, objectCtrl.createObject);
router.put('/:id', loggerMdl, objectCtrl.updateObject);
router.delete('/:id', loggerMdl, objectCtrl.deleteObject);

module.exports = router;