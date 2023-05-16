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
const Yup = __importStar(require("yup"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const CreateTokens_1 = require("../../helpers/CreateTokens");
const Company_1 = __importDefault(require("../../models/Company"));
const Setting_1 = __importDefault(require("../../models/Setting"));
const User_1 = __importDefault(require("../../models/User"));
const UpdateUserService = ({ Data }) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = Yup.object().shape({
        name: Yup.string().min(2),
        email: Yup.string().email(),
        passwordDefault: Yup.string().required()
    });
    const { email, passwordDefault, numberAttendants, name, numberConections, numberSetores, status } = Data;
    try {
        yield schema.validate({ email, passwordDefault, numberAttendants, name, numberConections, numberSetores });
    }
    catch (err) {
        throw new AppError_1.default(err.message);
    }
    const user = yield Company_1.default.create({
        email,
        passwordDefault,
        numberAttendants,
        name,
        numberConections,
        numberSetores,
        status
    });
    yield user.reload();
    const temp = yield User_1.default.create({
        email,
        password: passwordDefault,
        name,
        profile: 'admin',
        whatsappId: null,
        companyId: user.id
    }, { include: ["queues", "whatsapp"] });
    yield Setting_1.default.create({
        key: 'userApiToken',
        value: CreateTokens_1.createAccessToken(temp),
        companyId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    yield Setting_1.default.create({
        key: 'allowUserEditConnection',
        value: 'disabled',
        companyId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    yield Setting_1.default.create({
        key: 'transferTicket',
        value: 'disabled',
        companyId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    yield Setting_1.default.create({
        key: 'afterMinutesTicketWithoutDepartmentTransferTo',
        value: '',
        companyId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    yield Setting_1.default.create({
        key: 'afterMinutesToTransfer',
        value: '0',
        companyId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    yield Setting_1.default.create({
        key: 'hideTicketWithoutDepartment',
        value: 'disabled',
        companyId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    yield Setting_1.default.create({
        key: 'useBotByQueueSample',
        value: 'enabled',
        companyId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    yield Setting_1.default.create({
        key: 'showApiKeyInCompanies',
        value: 'disabled',
        companyId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    yield Setting_1.default.create({
        key: 'ticketAutoClose',
        value: '0',
        companyId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    yield Setting_1.default.create({
        key: 'timeCreateNewTicket',
        value: '7200',
        companyId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    yield Setting_1.default.create({
        key: "CheckMsgIsGroup",
        value: "enabled",
        companyId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    yield Setting_1.default.create({
        key: "call",
        value: "disabled",
        companyId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return { user };
});
exports.default = UpdateUserService;
