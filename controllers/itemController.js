const model = require('../models/item');
const Offer = require('../models/offer');
exports.items = (requ, res, next)=> {
    const { query } = requ.query;
    let queryFilter = { active: true };

    if(query) {
        queryFilter.$or = [
            { title: {$regex: new RegExp(query, 'i')}},
            { details: {$regex: new RegExp(query, 'i')}}
        ];
    } 

    model.find(queryFilter)
    .sort({ price: 1 })
    .then(items => {
        if (items.length === 0 && query) {
            return res.render('error', { error: { message: "No items found matching the search criteria." } });
        }
        
        res.render('./item/items', { items, query });
    })
    .catch(err=>next(err));
};

exports.new = (req, res)=> {
    res.render('./item/new');
};

exports.create = (req, res, next) => {
    let item = new model(req.body);
    item.seller = req.session.user;
    if(req.file) {
        item.image = '/images/' + req.file.filename;
    }
    item.totalOffers = '0';
    item.active = true;
    item.save()
    .then(item => { 
        req.flash('success', 'Your item was created successfully!')
        res.redirect('/items')
    })
    .catch(err=> {
        if(err.name === 'ValidationError' ) {
            req.flash('error', 'Incorrect input.');
            return res.redirect('back');
        }
        next(err);
    });
};

exports.show = (req,res,next)=> {
    let id = req.params.id;
    model.findById(id).populate('seller', 'firstName lastName')
    .then(item => {
        if(item) {
           return res.render('./item/item', {item});
        } else {
            let err = new Error('Cannot find a item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then(item => {
        return res.render('./item/edit', {item});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next) => {
    let item = req.body;
    let id = req.params.id;

    if(req.file) {
        item.image = '/images/' + req.file.filename;
    }
    item.totalOffers = '0';
    item.active = true;

    model.findByIdAndUpdate(id, item, {useFindAndModify: false, runValidators: true})
    .then(item => {
        req.flash('success', 'You have successfully edited this item');
        res.redirect('/items/'+id);
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            req.flash('error', 'Incorrect input.');
            return res.redirect('back');
        }
        next(err)
    });
};

exports.delete = (req,res,next)=> {
    // let id = req.params.id;

    // Offer.deleteMany({ offer:id })
    // .catch(err=>next(err));

    // model.findByIdAndDelete(id, {useFindAndModify: false})
    // .then(item => {
    //     req.flash('success', 'You have successfully deleted this item');
    //     res.redirect('/items');
    // })
    // .catch(err=>next(err));
    let id = req.params.id;

    Offer.deleteMany( {item: id })
    .then(() => {
        return model.findByIdAndDelete(id, {useFindAndModify: false})
    })
    .then(() => {
        req.flash('success', 'You have successfully deleted this item');
        res.redirect('/items');
    })
    .catch(err => { next(err)});
};
