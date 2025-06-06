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
exports.store = void 0;
const ImportContactsService_1 = __importDefault(require("../services/WbotServices/ImportContactsService"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line radix
    const userId = parseInt(req.user.id);
    const userJWT = req.headers.authorization && (yield jwt_decode_1.default(req.headers.authorization.replace('Bearer ', '')));
    yield ImportContactsService_1.default(userId, userJWT.companyId);
    return res.status(200).json({ message: "contacts imported" });
});
exports.store = store;
