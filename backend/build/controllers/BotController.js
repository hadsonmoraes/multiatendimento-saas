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
const CreateBotService_1 = __importDefault(require("../services/BotServices/CreateBotService"));
const DeleteBotService_1 = __importDefault(require("../services/BotServices/DeleteBotService"));
const ListBotsService_1 = __importDefault(require("../services/BotServices/ListBotsService"));
const ShowBotService_1 = __importDefault(require("../services/BotServices/ShowBotService"));
const UpdateBotService_1 = __importDefault(require("../services/BotServices/UpdateBotService"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    const bots = yield ListBotsService_1.default(userJWT.companyId);
    return res.status(200).json(bots);
});
exports.index = index;
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    const { commandBot, commandType, descriptionBot, queueId, showMessage, userId } = req.body;
    const bot = yield CreateBotService_1.default({ commandBot, commandType, descriptionBot, queueId, showMessage, userId, companyId: userJWT.companyId });
    const io = socket_1.getIO();
    io.emit(`bot-${userJWT.companyId}`, {
        action: "update",
        bot
    });
    return res.status(200).json(bot);
});
exports.store = store;
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { botId } = req.params;
    const bot = yield ShowBotService_1.default(botId);
    return res.status(200).json(bot);
});
exports.show = show;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { botId } = req.params;
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    const bot = yield UpdateBotService_1.default(botId, req.body);
    const io = socket_1.getIO();
    io.emit(`bot-${userJWT.companyId}`, {
        action: "update",
        bot
    });
    return res.status(201).json(bot);
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { botId } = req.params;
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    yield DeleteBotService_1.default(botId);
    const io = socket_1.getIO();
    io.emit(`bot-${userJWT.companyId}`, {
        action: "delete",
        botId: +botId
    });
    return res.status(200).send();
});
exports.remove = remove;
