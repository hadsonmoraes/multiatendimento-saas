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
exports.remove = exports.update = exports.store = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const AuthUserService_1 = __importDefault(require("../services/UserServices/AuthUserService"));
const SendRefreshToken_1 = require("../helpers/SendRefreshToken");
const RefreshTokenService_1 = require("../services/AuthServices/RefreshTokenService");
const ShowCompanyService_1 = __importDefault(require("../services/CompanyService/ShowCompanyService"));
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { token, serializedUser, refreshToken } = yield AuthUserService_1.default({
        email,
        password
    });
    SendRefreshToken_1.SendRefreshToken(res, refreshToken);
    return res.status(200).json({
        token,
        user: serializedUser
    });
});
exports.store = store;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jrt;
    if (!token) {
        throw new AppError_1.default("ERR_SESSION_EXPIRED", 401);
    }
    const { user, newToken, refreshToken } = yield RefreshTokenService_1.RefreshTokenService(res, token);
    if (user.companyId !== null) {
        const company = yield ShowCompanyService_1.default(user.companyId);
        if (!company.status) {
            throw new AppError_1.default("ERR_INACTIVE_COMPANY", 401);
        }
        user["company"] = company;
    }
    SendRefreshToken_1.SendRefreshToken(res, refreshToken);
    return res.json({ token: newToken, user });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("jrt");
    return res.send();
});
exports.remove = remove;
