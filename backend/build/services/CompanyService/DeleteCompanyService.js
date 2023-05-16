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
const Company_1 = __importDefault(require("../../models/Company"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Bot_1 = __importDefault(require("../../models/Bot"));
const Contact_1 = __importDefault(require("../../models/Contact"));
const Queue_1 = __importDefault(require("../../models/Queue"));
const QuickAnswer_1 = __importDefault(require("../../models/QuickAnswer"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const User_1 = __importDefault(require("../../models/User"));
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const DeleteCompanyService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const company = yield Company_1.default.findOne({
        where: { id }
    });
    if (!company) {
        throw new AppError_1.default("ERR_NO_CONTACT_FOUND", 404);
    }
    yield company.destroy();
    yield Bot_1.default.destroy({
        where: { companyId: id }
    });
    yield Contact_1.default.destroy({
        where: { companyId: id }
    });
    yield Queue_1.default.destroy({
        where: { companyId: id }
    });
    yield QuickAnswer_1.default.destroy({
        where: { companyId: id }
    });
    yield Ticket_1.default.destroy({
        where: { companyId: id }
    });
    yield User_1.default.destroy({
        where: { companyId: id }
    });
    yield Whatsapp_1.default.destroy({
        where: { companyId: id }
    });
});
exports.default = DeleteCompanyService;
