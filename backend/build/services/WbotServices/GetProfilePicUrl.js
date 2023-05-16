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
const GetDefaultWhatsApp_1 = __importDefault(require("../../helpers/GetDefaultWhatsApp"));
const wbot_1 = require("../../libs/wbot");
const logger_1 = require("../../utils/logger");
const GetProfilePicUrl = (number, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('Get a picture profile number ' + number + ' in business: ' + companyId);
    const defaultWhatsapp = yield GetDefaultWhatsApp_1.default(0, companyId);
    const wbot = wbot_1.getWbot(defaultWhatsapp.id);
    let profilePicUrl = yield wbot.getProfilePicUrl(`${number}@c.us`);
    if (!profilePicUrl)
        profilePicUrl = "/default-profile.png"; // Foto de perfil padrão  
    return profilePicUrl;
});
exports.default = GetProfilePicUrl;
