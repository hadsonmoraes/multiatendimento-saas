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
const wbot_1 = require("../libs/wbot");
const GetDefaultWhatsApp_1 = __importDefault(require("./GetDefaultWhatsApp"));
const GetTicketWbot = (ticket) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ticket.whatsappId) {
        const defaultWhatsapp = yield GetDefaultWhatsApp_1.default(ticket.user.id, ticket.companyId);
        yield ticket.$set("whatsapp", defaultWhatsapp);
    }
    const wbot = wbot_1.getWbot(ticket.whatsappId);
    return wbot;
});
exports.default = GetTicketWbot;
