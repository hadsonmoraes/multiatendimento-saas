"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert("Settings", [
            {
                key: "afterMinutesToTransfer",
                value: "0",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                key: "afterMinutesTicketWithoutDepartmentTransferTo",
                value: "",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },
    down: (queryInterface) => {
        return queryInterface.bulkDelete("Settings", {});
    }
};
