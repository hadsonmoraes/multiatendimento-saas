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
const AppError_1 = __importDefault(require("../errors/AppError"));
const Whatsapp_1 = __importDefault(require("../models/Whatsapp"));
const logger_1 = require("../utils/logger");
const GetDefaultWhatsAppByUser_1 = __importDefault(require("./GetDefaultWhatsAppByUser"));
const GetDefaultWhatsApp = (userId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId > 0) {
        const whatsappByUser = yield GetDefaultWhatsAppByUser_1.default(userId, companyId);
        if (whatsappByUser !== null) {
            return whatsappByUser;
        }
    }
    logger_1.logger.info('Get a WhastaApp connection default in business: ' + companyId);
    let defaultWhatsapp;
    defaultWhatsapp = yield Whatsapp_1.default.findOne({
        where: { isDefault: true, companyId: companyId }
    });
    if (!defaultWhatsapp) {
        logger_1.logger.info('Get any WhastaApp connection in business: ' + companyId);
        defaultWhatsapp = yield Whatsapp_1.default.findOne({
            where: { companyId: companyId }
        });
        if (!defaultWhatsapp) {
            logger_1.logger.warn('None WhatsApp connection found in business: ' + companyId);
            throw new AppError_1.default("ERR_NO_DEF_WAPP_FOUND");
        }
        else {
            return defaultWhatsapp;
        }
    }
    else {
        return defaultWhatsapp;
    }
});
exports.default = GetDefaultWhatsApp;
