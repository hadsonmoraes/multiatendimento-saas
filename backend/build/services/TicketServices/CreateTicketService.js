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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const CheckContactOpenTickets_1 = __importDefault(require("../../helpers/CheckContactOpenTickets"));
const GetDefaultWhatsApp_1 = __importDefault(require("../../helpers/GetDefaultWhatsApp"));
const GetDefaultWhatsAppByUser_1 = __importDefault(require("../../helpers/GetDefaultWhatsAppByUser"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const User_1 = __importDefault(require("../../models/User"));
const ShowContactService_1 = __importDefault(require("../ContactServices/ShowContactService"));
const CreateTicketService = ({ contactId, status, userId, queueId, companyId }) => __awaiter(void 0, void 0, void 0, function* () {
    let defaultWhatsapp = yield GetDefaultWhatsAppByUser_1.default(userId, companyId);
    if (!defaultWhatsapp || defaultWhatsapp == null || defaultWhatsapp == undefined) {
        defaultWhatsapp = yield GetDefaultWhatsApp_1.default(userId, companyId);
    }
    yield CheckContactOpenTickets_1.default(contactId, defaultWhatsapp.id, companyId);
    const { isGroup } = yield ShowContactService_1.default(contactId);
    if (queueId === undefined) {
        const user = yield User_1.default.findByPk(userId, { include: ["queues"] });
        queueId = (user === null || user === void 0 ? void 0 : user.queues.length) === 1 ? user.queues[0].id : undefined;
    }
    const { id } = yield defaultWhatsapp.$create("ticket", {
        contactId,
        status,
        isGroup,
        userId,
        queueId,
        companyId
    });
    const ticket = yield Ticket_1.default.findByPk(id, { include: ["contact"] });
    if (!ticket) {
        throw new AppError_1.default("ERR_CREATING_TICKET");
    }
    return ticket;
});
exports.default = CreateTicketService;
