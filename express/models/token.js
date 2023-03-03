// This model needs for links

'use strict';
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const errors = require('../helpers/errors');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        static associate(models) {
            Token.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userId',
                onDelete: 'CASCADE',
            });
        }
    }

    Token.init(
        {
            uuid: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: {
                field: 'user_id',
                type: DataTypes.UUID,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expiresIn: {
                field: 'expires_in',
                type: DataTypes.DATE,
                allowNull: false,
            },
            data: {
                type: DataTypes.TEXT,
                allowNull: true,
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
            modelName: 'Token',
            tableName: 'tokens',
            timestamps: true,
        }
    );

    return Token;
};
