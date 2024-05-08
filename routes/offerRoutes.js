const express = require('express');
const {isSeller, isLoggedIn} = require('../middleware/auth');
const controller = require('../controllers/offerController');
const {validateMakingOffer, validateResult} = require('../middleware/validator');


const router = express.Router({mergeParams:true});

//View all offers
router.get('/', isLoggedIn, isSeller, controller.viewOffers);

// //Make an offer
router.post('/', isLoggedIn, validateMakingOffer, validateResult, controller.createOffer);

//accept an offer
router.post('/:offerId/accept', isLoggedIn, isSeller, controller.acceptOffer)

module.exports = router;