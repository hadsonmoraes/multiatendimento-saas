"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.index = void 0;
const Yup = __importStar(require("yup"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const GetDefaultWhatsApp_1 = __importDefault(require("../helpers/GetDefaultWhatsApp"));
const SetTicketMessagesAsRead_1 = __importDefault(require("../helpers/SetTicketMessagesAsRead"));
const Whatsapp_1 = __importDefault(require("../models/Whatsapp"));
const CreateOrUpdateContactService_1 = __importDefault(require("../services/ContactServices/CreateOrUpdateContactService"));
const FindOrCreateTicketService_1 = require("../services/TicketServices/FindOrCreateTicketService");
const ShowTicketService_1 = __importDefault(require("../services/TicketServices/ShowTicketService"));
const CheckIsValidContact_1 = __importDefault(require("../services/WbotServices/CheckIsValidContact"));
const CheckNumber_1 = __importDefault(require("../services/WbotServices/CheckNumber"));
const GetProfilePicUrl_1 = __importDefault(require("../services/WbotServices/GetProfilePicUrl"));
const SendWhatsAppMedia_1 = __importDefault(require("../services/WbotServices/SendWhatsAppMedia"));
const SendWhatsAppMessage_1 = __importDefault(require("../services/WbotServices/SendWhatsAppMessage"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const createContact = (whatsappId, newContact, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    yield CheckIsValidContact_1.default(newContact, companyId);
    const validNumber = yield CheckNumber_1.default(newContact, companyId);
    let profilePicUrl = yield GetProfilePicUrl_1.default(validNumber, companyId);
    if (!profilePicUrl)
        profilePicUrl = "/default-profile.png"; // Foto de perfil padrão    
    const number = validNumber;
    const contactData = {
        name: `${number}`,
        number,
        profilePicUrl,
        isGroup: false,
        companyId: companyId
    };
    const contact = yield CreateOrUpdateContactService_1.default(contactData);
    let whatsapp;
    if (whatsappId === undefined) {
        whatsapp = yield GetDefaultWhatsApp_1.default(0, companyId);
    }
    else {
        whatsapp = yield Whatsapp_1.default.findByPk(whatsappId);
        if (whatsapp === null) {
            throw new AppError_1.default(`whatsapp #${whatsappId} not found`);
        }
    }
    const createTicket = yield FindOrCreateTicketService_1.FindOrCreateTicketService(contact, whatsapp.id, whatsapp.companyId);
    const ticket = yield ShowTicketService_1.default(createTicket.id, createTicket.companyId);
    SetTicketMessagesAsRead_1.default(ticket);
    return ticket;
});
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newContact = req.body;
    const { whatsappId } = req.body;
    const { body, quotedMsg } = req.body;
    const medias = req.files;
    newContact.number = newContact.number.replace("-", "").replace(" ", "");
    const schema = Yup.object().shape({
        number: Yup.string()
            .required()
            .matches(/^\d+$/, "Invalid number format. Only numbers is allowed.")
    });
    try {
        yield schema.validate(newContact);
    }
    catch (err) {
        throw new AppError_1.default(err.message);
    }
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    const contactAndTicket = yield createContact(whatsappId, newContact.number, userJWT.companyId);
    if (medias) {
        yield Promise.all(medias.map((media) => __awaiter(void 0, void 0, void 0, function* () {
            yield SendWhatsAppMedia_1.default({ body, media, ticket: contactAndTicket });
        })));
    }
    else {
        yield SendWhatsAppMessage_1.default({ body, ticket: contactAndTicket, quotedMsg });
    }
    return res.send();
});
exports.index = index;
