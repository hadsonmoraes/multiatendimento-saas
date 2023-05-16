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
const Bot_1 = __importDefault(require("../../models/Bot"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Queue_1 = __importDefault(require("../../models/Queue"));
const User_1 = __importDefault(require("../../models/User"));
const logger_1 = require("../../utils/logger");
const ShowBotsService = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('Get botService to business: ' + companyId);
    const bots = yield Bot_1.default.findAll({
        where: { companyId: companyId },
        include: [
            {
                model: Queue_1.default,
                as: "queue",
                attributes: ["id", "name"]
            },
            {
                model: User_1.default,
                as: "user",
                attributes: ["id", "name"]
            }
        ],
        order: [["commandBot", "ASC"]]
    });
    if (!bots) {
        throw new AppError_1.default("ERR_NO_BOTS_FOUND", 404);
    }
    return bots;
});
exports.default = ShowBotsService;
