"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Companies", "numberSetores", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Companies", "numberSetores");
    }
};
