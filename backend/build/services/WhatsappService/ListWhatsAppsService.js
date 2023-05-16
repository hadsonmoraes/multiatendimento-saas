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
const sequelize_1 = require("sequelize");
const Company_1 = __importDefault(require("../../models/Company"));
const Queue_1 = __importDefault(require("../../models/Queue"));
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const ListWhatsAppsService = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    let whereCondition = {};
    if (companyId > 0) {
        whereCondition = {
            [sequelize_1.Op.and]: [{ companyId: companyId }],
        };
    }
    const whatsapps = yield Whatsapp_1.default.findAll({
        where: whereCondition,
        include: [
            {
                model: Queue_1.default,
                as: "queues",
                attributes: ["id", "name", "color", "greetingMessage", "startWork", "endWork", "absenceMessage"]
            },
            {
                model: Company_1.default,
                as: "company",
                attributes: ["id", "name"]
            }
        ]
    });
    return whatsapps;
});
process.setMaxListeners(0);
exports.default = ListWhatsAppsService;
