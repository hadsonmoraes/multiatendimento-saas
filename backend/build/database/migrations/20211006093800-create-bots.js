"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable("Bots", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            commandBot: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            commandType: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            showMessage: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: { model: "Users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },
            queueId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                references: { model: "Queues", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },
            companyId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Companies", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE(6),
                allowNull: false
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE(6),
                allowNull: false
            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable("Bots");
    }
};
