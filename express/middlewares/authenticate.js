'use strict';
const jwt = require('jsonwebtoken');
const errors = require('../helpers/errors');
const { User, Operator } = require('../models');

module.exports = function authenticate(roles) {
    return errors.wrap(async function (req, res, next) {
        if (!roles || Array.isArray(roles)) {
            if (!('authorization' in req.headers)) return res.status(403).send('Missing authorization header');
            const token = req.headers['authorization'].split(' ')[1];
            let payload;

            try {
                payload = jwt.verify(token, process.env.EXPRESS_SALT || 'salt');
            } catch (err) {
                throw errors.UnauthorizedError(err.name);
            }
            const user = await User.findByPk(payload.userId, {
                include: { model: Operator, as: 'operator' },
            });
            if (!user) throw errors.NotFound('Users not found');
            if (roles && roles.length && !roles.includes(user.role))
                throw errors.NotAllowed(`your role ${user.role} is not allowed, a role is needed ${roles}`);

            res.locals.user = user;

            next();
        }
    });
};
