const {check, validationError} = require('express-validator');

exports.createPostValidator = (req, res, next) => {
    // title
    req.check('title', 'Title is required').isEmpty();
    req.check('title', 'Title must be between 4 to 150 characters').isLength({
        min: 4,
        max: 150
    });
    console.log('kajsbdka');
    // body
    req.check('body', 'Body is required').isEmpty();
    req.check('body', 'Body must be between 4 to 2000 characters').isLength({
        min: 4,
        max: 2000
    });

    // Check for errors
    const errors = req.validationError();
    if(errors) {
        const firstError = errors.map(err => err.msg)[0];
        return res.status(400).json({
            error: firstError
        });
    }

    next();
};