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
exports.ConstructMenu = void 0;
const ShowBotsService_1 = __importDefault(require("../WhatsappService/ShowBotsService"));
const ConstructMenu = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const bots = yield ShowBotsService_1.default(companyId);
    let options = "";
    bots.forEach((bot, index) => {
        if (bot.commandBot.indexOf(".") === -1) {
            switch (bot.commandType) {
                case 1:
                    options += `*${bot.commandBot}* - ${bot.descriptionBot}\n`;
                    break;
                case 2:
                    options += `*${bot.commandBot}* - ${bot.descriptionBot}\n`;
                    break;
                case 3:
                    options += `*${bot.commandBot}* - ${bot.queue.name}\n`;
                    break;
                case 4:
                    options += `*${bot.commandBot}* - ${bot.user.name}\n`;
                    break;
            }
        }
    });
    return options;
});
exports.ConstructMenu = ConstructMenu;
