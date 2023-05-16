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
const sequelize_1 = require("sequelize");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const ShowWhatsAppService_1 = __importDefault(require("./ShowWhatsAppService"));
const AssociateWhatsappQueue_1 = __importDefault(require("./AssociateWhatsappQueue"));
const logger_1 = require("../../utils/logger");
const UpdateWhatsAppService = ({ whatsappData, whatsappId }) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.warn('Validating data and updating whatsapp connection in business: ' + (whatsappData === null || whatsappData === void 0 ? void 0 : whatsappData.companyId));
    const schema = Yup.object().shape({
        name: Yup.string().min(2),
        status: Yup.string(),
        isDefault: Yup.boolean()
    });
    const { name, status, isDefault, session, greetingMessage, farewellMessage, queueIds = [], companyId } = whatsappData;
    logger_1.logger.info('Business selected to update in whatsapp connection is: ' + companyId);
    try {
        yield schema.validate({ name, status, isDefault });
    }
    catch (err) {
        throw new AppError_1.default(err.message);
    }
    if (queueIds.length > 1 && !greetingMessage) {
        throw new AppError_1.default("ERR_WAPP_GREETING_REQUIRED");
    }
    let oldDefaultWhatsapp = null;
    if (isDefault) {
        oldDefaultWhatsapp = yield Whatsapp_1.default.findOne({
            where: {
                isDefault: true,
                companyId: whatsappData === null || whatsappData === void 0 ? void 0 : whatsappData.companyId
            }
        });
        if (oldDefaultWhatsapp) {
            logger_1.logger.warn('Updateting connection default to false in business: ' + (whatsappData === null || whatsappData === void 0 ? void 0 : whatsappData.companyId));
            yield oldDefaultWhatsapp.update({
                where: { isDefault: false, companyId: { [sequelize_1.Op.eq]: whatsappData === null || whatsappData === void 0 ? void 0 : whatsappData.companyId } }
            });
        }
    }
    const whatsapp = yield ShowWhatsAppService_1.default(whatsappId);
    yield whatsapp.update({
        name,
        status,
        session,
        greetingMessage,
        farewellMessage,
        isDefault
    });
    yield AssociateWhatsappQueue_1.default(whatsapp, queueIds);
    return { whatsapp, oldDefaultWhatsapp };
});
exports.default = UpdateWhatsAppService;
