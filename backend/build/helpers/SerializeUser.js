"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializeUser = void 0;
const SerializeUser = (user) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        queues: user.queues,
        whatsapp: user.whatsapp,
        companyId: user.companyId,
        company: user.company
    };
};
exports.SerializeUser = SerializeUser;
