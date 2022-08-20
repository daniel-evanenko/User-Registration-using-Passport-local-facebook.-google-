const { check, body} = require('express-validator')
const UserModel = require('../models/User')
const express = require('express')


const registerSchema = [
    check('username', 'This username must be more than 3 characters long')
    .exists()
    .isLength({ min: 3 }),
    check('email', 'Email is not valid')
    .isEmail()
    .normalizeEmail(),
    body('email').custom(value => {
        return UserModel.findOne({ email: value }).then(user => {
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        });
    }),

    check('password', 'Password must be more then 8 charecters long')
    .isLength({
        min: 8
    })
    .matches('^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$')
    .withMessage('Password must have at least one lowercase, at least one uppercase, at least one digit'),
    body('passwordConfirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }

        // Indicates the success of this synchronous custom validator
        return true;
    })
]

module.exports  = registerSchema