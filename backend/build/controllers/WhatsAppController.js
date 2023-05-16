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
exports.remove = exports.update = exports.show = exports.store = exports.index = void 0;
const socket_1 = require("../libs/socket");
const wbot_1 = require("../libs/wbot");
const AppError_1 = __importDefault(require("../errors/AppError"));
const StartWhatsAppSession_1 = require("../services/WbotServices/StartWhatsAppSession");
const CreateWhatsAppService_1 = __importDefault(require("../services/WhatsappService/CreateWhatsAppService"));
const DeleteWhatsAppService_1 = __importDefault(require("../services/WhatsappService/DeleteWhatsAppService"));
const ListWhatsAppsService_1 = __importDefault(require("../services/WhatsappService/ListWhatsAppsService"));
const ShowWhatsAppService_1 = __importDefault(require("../services/WhatsappService/ShowWhatsAppService"));
const UpdateWhatsAppService_1 = __importDefault(require("../services/WhatsappService/UpdateWhatsAppService"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const ShowCompanyService_1 = __importDefault(require("../services/CompanyService/ShowCompanyService"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    const whatsapps = yield ListWhatsAppsService_1.default(userJWT.companyId);
    return res.status(200).json(whatsapps);
});
exports.index = index;
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    const WhatsApps = yield ListWhatsAppsService_1.default(userJWT.companyId);
    const company = yield ShowCompanyService_1.default(userJWT.companyId);
    if (WhatsApps.length >= Number(company.dataValues.numberConections)) {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { name, status, isDefault, greetingMessage, farewellMessage, queueIds } = req.body;
    const { whatsapp, oldDefaultWhatsapp } = yield CreateWhatsAppService_1.default({
        name,
        status,
        isDefault,
        greetingMessage,
        farewellMessage,
        queueIds,
        companyId: userJWT.companyId
    });
    StartWhatsAppSession_1.StartWhatsAppSession(whatsapp);
    const io = socket_1.getIO();
    io.emit(`whatsapp-${userJWT.companyId}`, {
        action: "update",
        whatsapp
    });
    if (oldDefaultWhatsapp) {
        io.emit("whatsapp", {
            action: "update",
            whatsapp: oldDefaultWhatsapp
        });
    }
    return res.status(200).json(whatsapp);
});
exports.store = store;
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { whatsappId } = req.params;
    const whatsapp = yield ShowWhatsAppService_1.default(whatsappId);
    return res.status(200).json(whatsapp);
});
exports.show = show;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { whatsappId } = req.params;
    const whatsappData = req.body;
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    if (!whatsappData)
        whatsappData.companyId = userJWT.companyId;
    const { whatsapp, oldDefaultWhatsapp } = yield UpdateWhatsAppService_1.default({
        whatsappData,
        whatsappId
    });
    const io = socket_1.getIO();
    io.emit(`whatsapp-${userJWT.companyId}`, {
        action: "update",
        whatsapp
    });
    if (oldDefaultWhatsapp) {
        io.emit("whatsapp", {
            action: "update",
            whatsapp: oldDefaultWhatsapp
        });
    }
    return res.status(200).json(whatsapp);
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { whatsappId } = req.params;
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    yield DeleteWhatsAppService_1.default(whatsappId);
    wbot_1.removeWbot(+whatsappId);
    const io = socket_1.getIO();
    io.emit(`whatsapp-${userJWT.companyId}`, {
        action: "delete",
        whatsappId: +whatsappId
    });
    return res.status(200).json({ message: "Whatsapp deleted." });
});
exports.remove = remove;
