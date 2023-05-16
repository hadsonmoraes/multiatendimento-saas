"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Settings", "id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Settings", "id");
    }
};
