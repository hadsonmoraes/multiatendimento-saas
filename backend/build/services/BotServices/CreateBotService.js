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
const Bot_1 = __importDefault(require("../../models/Bot"));
const CreateBotService = (botData) => __awaiter(void 0, void 0, void 0, function* () {
    const { commandBot, commandType, descriptionBot, queueId, showMessage, userId, companyId } = botData;
    const botSchema = Yup.object().shape({
        commandBot: Yup.string()
            .required("ERR_BOT_INVALID_COMMAND")
            .test("Check-unique-command", "ERR_BOT_COMMAND_ALREADY_EXISTS", (value) => __awaiter(void 0, void 0, void 0, function* () {
            if (value) {
                const botWithSameCommand = yield Bot_1.default.findOne({
                    where: { commandBot: value, companyId }
                });
                return !botWithSameCommand;
            }
            return false;
        })),
        commandType: Yup.string()
            .required("ERR_BOT_INVALID_TYPE"),
    });
    try {
        yield botSchema.validate({ commandBot, commandType, descriptionBot, queueId, showMessage, userId, companyId });
    }
    catch (err) {
        throw new AppError_1.default(err.message);
    }
    const queue = yield Bot_1.default.create(botData);
    return queue;
});
exports.default = CreateBotService;
