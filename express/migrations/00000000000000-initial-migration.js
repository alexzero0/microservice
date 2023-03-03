'use strict';

module.exports = {
    up: async (Sequelize, DataTypes) => {
        await Sequelize.createTable('users', {
            uuid: {
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING(128),
                allowNull: false,
                unique: true,
            },
            name: DataTypes.STRING,
            password: {
                type: DataTypes.STRING(512),
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
        });

        await Sequelize.createTable('tokens', {
            uuid: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: {
                field: 'user_id',
                type: DataTypes.UUID,
                references: {
                    model: 'users',
                    key: 'uuid',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
        });
    },

    down: async (Sequelize, DataTypes) => {
        await Sequelize.dropTable('tokens');
        await Sequelize.dropTable('users');
    },
};
