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
exports.update = exports.index = void 0;
const socket_1 = require("../libs/socket");
const AppError_1 = __importDefault(require("../errors/AppError"));
const UpdateSettingService_1 = __importDefault(require("../services/SettingServices/UpdateSettingService"));
const ListSettingsService_1 = __importDefault(require("../services/SettingServices/ListSettingsService"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const logger_1 = require("../utils/logger");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    const settings = yield ListSettingsService_1.default(userJWT.companyId);
    return res.status(200).json(settings);
});
exports.index = index;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    const companyId = userJWT.companyId;
    logger_1.logger.warn('Processing requisited update in business: ' + companyId);
    const { settingKey: key } = req.params;
    const { value } = req.body;
    const setting = yield UpdateSettingService_1.default({
        key,
        value,
        companyId
    });
    const io = socket_1.getIO();
    io.emit(`settings-${userJWT.companyId}`, {
        action: "update",
        setting
    });
    return res.status(200).json(setting);
});
exports.update = update;
