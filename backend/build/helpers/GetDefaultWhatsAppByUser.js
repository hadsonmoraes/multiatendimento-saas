"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const logger_1 = require("../utils/logger");
const GetDefaultWhatsAppByUser = (userId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('Get a WhastaApp connection default by user ' + userId + ' and in business: ' + companyId);
    const user2 = yield User_1.default.findAll({
        where: { id: userId, companyId: companyId }
    });
    const user = user2.dataValues;
    if (user === null || user === undefined) {
        logger_1.logger.warn('Not found WhatsApp connection by user');
        return null;
    }
    if (user.whatsapp !== undefined && user.whatsapp !== null) {
        logger_1.logger.info(`Found whatsapp linked to user '${user.name}' is '${user.whatsapp.name}' with business: '${user.whatsapp.companyId}'`);
    }
    return user.whatsapp;
});
exports.default = GetDefaultWhatsAppByUser;
