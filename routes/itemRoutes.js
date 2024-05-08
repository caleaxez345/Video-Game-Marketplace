const express = require('express');
const controller = require('../controllers/itemController');
const { upload } = require('../middleware/fileUpload');
const {isLoggedIn, isSeller} = require('../middleware/auth');
const {validateId, validateCreatingAndUpdatingItem, validateResult} = require('../middleware/validator');
const offerRoutes = require('./offerRoutes');


const router = express.Router({mergeParams: true});

router.get('/', controller.items);

router.get('/new', isLoggedIn, controller.new);

router.post('/', upload, isLoggedIn, validateCreatingAndUpdatingItem, validateResult, controller.create);

router.get('/:id', validateId, controller.show);

router.get('/:id/edit', validateId, isSeller, controller.edit);

router.put('/:id', upload, validateId, isSeller, validateCreatingAndUpdatingItem, validateResult, controller.update);

router.delete('/:id', validateId, isSeller, controller.delete);

router.use('/:id/offers', offerRoutes);

module.exports = router;