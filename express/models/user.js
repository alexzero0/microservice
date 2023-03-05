'use strict';
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const errors = require('../helpers/errors');

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {}
    }

    User.init(
        {
            uuid: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            email: {
                type: DataTypes.STRING(512),
                allowNull: false,
                unique: true,
            },
            name: DataTypes.STRING,
            password: {
                type: DataTypes.STRING(512),
                set: function (password) {
                    this.setDataValue('password', User.hashPassword(password));
                },
            },
            role: {
                type: DataTypes.STRING(20),
            },
            createdAt: {
                type: DataTypes.DATE,
                field: 'created_at',
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: 'updated_at',
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
        }
    );

    User.authenticate = async (email, password) => {
        const user = await User.findOne({
            where: { email: email },
            attributes: [...User.publicAttributes, 'password'],
        });
        if (!user) throw errors.NotFound('User not found!');
        if (!user.password) throw errors.NotAllowed('Password not set! Please contact support.');
        // if (!user.isActive)
        //   throw errors.NotAllowed(
        //     'Your account has ben disabled, please contact support.'
        //   );
        if (user.password !== User.hashPassword(password)) throw errors.UnauthorizedError('Invalid credentials');
        return user;
    };

    /**
     * @param {string} password
     * @return {any} hash
     */
    User.hashPassword = (password) => {
        return crypto
            .createHmac('sha512', process.env.EXPRESS_SALT || 'salt')
            .update(password)
            .digest('hex');
    };

    /**
     * Generate Authentication Token for user
     * @return {{type: string, expiresIn: *, accessToken: *}}
     */
    User.prototype.generateToken = async function () {
        const salt = process.env.EXPRESS_SALT || 'salt';
        const data = {
            userId: this.uuid,
            userRole: this.role,
        };

        const tokenLifeTime = process.env.EXPRESS_TOKEN_LIFE_TIME || 600000;
        return {
            type: 'Bearer',
            expiresIn: tokenLifeTime,
            accessToken: jwt.sign(data, salt, { expiresIn: tokenLifeTime }),
        };
    };

    User.publicAttributes = [..._.without(_.keys(User.getAttributes), 'createdAt', 'updatedAt', 'password')];

    return User;
};
