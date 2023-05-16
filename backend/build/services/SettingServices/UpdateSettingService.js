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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Setting_1 = __importDefault(require("../../models/Setting"));
const logger_1 = require("../../utils/logger");
const UpdateSettingService = ({ key, value, companyId }) => __awaiter(void 0, void 0, void 0, function* () {
    if (companyId)
        logger_1.logger.info('Requisited update in params with key ' + key + ' value ' + value + ' in business: ' + companyId);
    else
        logger_1.logger.warn('Requisited update in params with key ' + key + ' value ' + value + ' as SuperAdmin ');
    let setting;
    setting = yield Setting_1.default.findOne({
        where: {
            key
        }
    });
    if (!(setting)) {
        throw new AppError_1.default("ERR_NO_SETTING_FOUND", 404);
    }
    if (companyId && companyId > 0) {
        yield Setting_1.default.update({ value }, {
            where: {
                key, companyId
            }
        });
    }
    else {
        yield Setting_1.default.update({ value }, {
            where: {
                key
            }
        });
    }
    return setting;
});
exports.default = UpdateSettingService;
