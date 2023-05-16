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
const AppError_1 = __importDefault(require("../errors/AppError"));
const ListSettingByValueService_1 = __importDefault(require("../services/SettingServices/ListSettingByValueService"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const logger_1 = require("../utils/logger");
const isAuthApi = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.warn('Access systema by Auth api Key...');
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.default("ERR_SESSION_EXPIRED", 401);
    }
    const [, token] = authHeader.split(" ");
    const userJWT = token && (yield jwt_decode_1.default(token));
    try {
        logger_1.logger.warn('Try with business in access token is: ' + userJWT.companyId);
        const getToken = yield ListSettingByValueService_1.default(token, userJWT.companyId);
        if (!getToken) {
            throw new AppError_1.default("ERR_SESSION_EXPIRED", 401);
        }
        if (getToken.value !== token) {
            throw new AppError_1.default("ERR_SESSION_EXPIRED", 401);
        }
        if (getToken.companyId !== userJWT.companyId) {
            throw new AppError_1.default("ERR_SESSION_EXPIRED", 401);
        }
    }
    catch (err) {
        throw new AppError_1.default("Invalid token. We'll try to assign a new one on next request", 403);
    }
    return next();
});
exports.default = isAuthApi;
