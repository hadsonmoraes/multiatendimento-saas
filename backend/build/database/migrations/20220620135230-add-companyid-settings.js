"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Settings", "companyId", {
            type: sequelize_1.DataTypes.INTEGER,
            references: { model: "Companies", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            allowNull: true
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Settings", "companyId");
    }
};
