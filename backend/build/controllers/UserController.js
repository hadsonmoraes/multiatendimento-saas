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
const AppError_1 = __importDefault(require("../errors/AppError"));
const CreateUserService_1 = __importDefault(require("../services/UserServices/CreateUserService"));
const ListUsersService_1 = __importDefault(require("../services/UserServices/ListUsersService"));
const UpdateUserService_1 = __importDefault(require("../services/UserServices/UpdateUserService"));
const ShowUserService_1 = __importDefault(require("../services/UserServices/ShowUserService"));
const DeleteUserService_1 = __importDefault(require("../services/UserServices/DeleteUserService"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const ShowCompanyService_1 = __importDefault(require("../services/CompanyService/ShowCompanyService"));
const ShowUserService2_1 = __importDefault(require("../services/UserServices/ShowUserService2"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchParam, pageNumber } = req.query;
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    const { users, count, hasMore } = yield ListUsersService_1.default({
        searchParam,
        pageNumber,
        companyId: userJWT.companyId
    });
    return res.json({ users, count, hasMore });
});
exports.index = index;
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    const users = yield ShowUserService2_1.default(userJWT.companyId);
    const company = yield ShowCompanyService_1.default(userJWT.companyId);
    const v1 = Number(users.length);
    const v2 = Number(company.dataValues.numberAttendants);
    if (v1 >= v2) {
        throw new AppError_1.default("ERR_NO_LIMIT_USER", 403);
    }
    const { email, password, name, profile, queueIds, whatsappId } = req.body;
    const user = yield CreateUserService_1.default({
        email,
        password,
        name,
        profile,
        queueIds,
        whatsappId,
        companyId: userJWT.companyId
    });
    const io = socket_1.getIO();
    io.emit(`user-${userJWT.companyId}`, {
        action: "create",
        user
    });
    return res.status(200).json(user);
});
exports.store = store;
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield ShowUserService_1.default(userId);
    return res.status(200).json(user);
});
exports.show = show;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { userId } = req.params;
    const userData = req.body;
    const user = yield UpdateUserService_1.default({ userData, userId });
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    const io = socket_1.getIO();
    io.emit(`user-${userJWT.companyId}`, {
        action: "update",
        user
    });
    return res.status(200).json(user);
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    yield DeleteUserService_1.default(userId);
    const io = socket_1.getIO();
    io.emit(`user-${userJWT.companyId}`, {
        action: "delete",
        userId
    });
    return res.status(200).json({ message: "User deleted" });
});
exports.remove = remove;
