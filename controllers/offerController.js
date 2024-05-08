const model = require('../models/offer');
const Item = require('../models/item');

exports.createOffer = (req, res, next) => {
    let itemId = req.params.id;
    let userId = req.session.user;

    Item.findById(itemId)
    .then((item) => {
        if(item.seller.toString() === userId.toString()) {
            let err = new Error('You cannot place an offer on an item you are selling!');
            err.status = 401;
            throw err;
        }
        const offer = new model({
            item: itemId,
            user: userId,
            amount: req.body.amount
        });

        return offer.save();
        })
        .then((offer)=> {
            return Item.findByIdAndUpdate(itemId, {
                $inc: { totalOffers: 1},
                $max: { highestOffer: offer.amount},
            }, {new: true});
        })
        .then(() => {
            req.flash('success', 'You have successfully made an offer!');
            res.redirect(`/items/${itemId}`);
        })
    .catch(err=>next(err));
};

exports.viewOffers = (req, res, next) => {
    let itemId = req.params.id;

    model.find({item: itemId}).populate('user').populate('item')
    .then(offers => {
        if(offers) {
            return res.render('./offer/offers', { offers: offers });
        }
        else { 
            offers.seller.toString() !== userId.toString()
            let err = new Error('You dont have permission to view received offers for this item!');
            err.status = 401;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.acceptOffer = (req, res, next) => {
    const itemId = req.params.id;
    const offerId = req.params.offerId;

    try{
        Item.findById(itemId)
        .then((item) => {
            item.active = false;
            return item.save();
        })
        .then(() => {
            return model.findByIdAndUpdate(offerId, {status: 'accepted'})
        })
        .then(() => {
            return model.updateMany({ item: itemId, _id: {$ne: offerId}, status: 'pending'}, 
            {status: 'rejected'}
            );
        })
        .then (() => {
            res.redirect(`/items/${itemId}/offers`)
        })
        .catch((err) => {
            next(err);
        })
    } catch (err) {
        next(err);
    }
};