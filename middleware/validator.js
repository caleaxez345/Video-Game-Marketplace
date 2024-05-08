const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next) => {
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
}

exports.validateSignup = [body('firstName','First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').notEmpty().isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be atleast 8 characters and at most 64 characters').isLength({min: 8, max:64}).notEmpty().trim()];

exports.validateLogin = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be atleast 8 characters and at most 64 characters').isLength({min: 8, max:64}).notEmpty().trim()];

exports.validateCreatingAndUpdatingItem = [body('condition', 'Condition cannot be empty').isIn(['New', 'Like New', 'Very Good', 'Good', 'Other']).notEmpty().trim().escape(),
body('title', 'Title cannot be empty').notEmpty().trim().escape(), 
body('price', 'Price must be greater than 0').isFloat({min:0.01}).notEmpty().trim().escape(),
body('details', 'Details cannot be empty').notEmpty().trim().escape(),
body('image').custom((value, { req }) => {
    if(!req.file) {
        throw new Error('Image upload is required!');
    }
    return true;
    })
];
// body('image', 'Image cannot be empty').notEmpty().trim()];

exports.validateMakingOffer = [body('amount', 'Amount cannot be empty').isFloat({min:0.01}).notEmpty().trim().escape()];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let uniqueErrors = [];
        errors.array().forEach(error => {
            if (!uniqueErrors.includes(error.msg)) {
                uniqueErrors.push(error.msg);
            }
        });

        uniqueErrors.forEach(errorMsg => {
            req.flash('error', errorMsg);
        });
        
        return res.redirect('back');
    } else {
        return next();
    }
}