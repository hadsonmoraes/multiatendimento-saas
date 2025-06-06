"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Contacts", "commandBot", {
            type: sequelize_1.DataTypes.TEXT
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Contacts", "commandBot");
    }
};
