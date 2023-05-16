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
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Contact_1 = __importDefault(require("../../models/Contact"));
const User_1 = __importDefault(require("../../models/User"));
const Queue_1 = __importDefault(require("../../models/Queue"));
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const logger_1 = require("../../utils/logger");
const ShowTicketService = (id, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.warn('Get a ticket to id ' + id + ' in business: ' + companyId);
    let ticket;
    try {
        ticket = yield Ticket_1.default.findOne({
            where: {
                id: id,
                companyId: companyId
            },
            include: [
                {
                    model: Contact_1.default,
                    as: "contact",
                    attributes: ["id", "name", "number", "profilePicUrl", "email"],
                    include: ["extraInfo"]
                },
                {
                    model: User_1.default,
                    as: "user",
                    attributes: ["id", "name"]
                },
                {
                    model: Queue_1.default,
                    as: "queue",
                    attributes: ["id", "name", "color"]
                },
                {
                    model: Whatsapp_1.default,
                    as: "whatsapp",
                    attributes: ["name"]
                }
            ]
        });
    }
    catch (err) {
        logger_1.logger.error('Error searching ticket in ShowTicketService, error: \n' + err);
    }
    if (!ticket) {
        logger_1.logger.error("ERR_NO_TICKET_FOUND");
        throw new AppError_1.default("ERR_NO_TICKET_FOUND", 404);
    }
    return ticket;
});
exports.default = ShowTicketService;
