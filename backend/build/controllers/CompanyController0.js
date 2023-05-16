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
exports.remove = exports.externaCreate = exports.create = exports.update = exports.show = exports.index = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const ListCompanyService_1 = __importDefault(require("../services/CompanyService/ListCompanyService"));
const ShowCompanyService_1 = __importDefault(require("../services/CompanyService/ShowCompanyService"));
const UpdateCompanyService_1 = __importDefault(require("./../services/CompanyService/UpdateCompanyService"));
const CreateCompanyService_1 = __importDefault(require("./../services/CompanyService/CreateCompanyService"));
const CreateCompanyExternalService_1 = __importDefault(require("./../services/CompanyService/CreateCompanyExternalService"));
const DeleteCompanyService_1 = __importDefault(require("../services/CompanyService/DeleteCompanyService"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchParam, pageNumber } = req.query;
    const { company, count, hasMore } = yield ListCompanyService_1.default({
        searchParam,
        pageNumber
    });
    return res.json({ company, count, hasMore });
});
exports.index = index;
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const contact = yield ShowCompanyService_1.default(id);
    return res.status(200).json(contact);
});
exports.show = show;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { Id } = req.params;
    const Data = req.body;
    const user = yield UpdateCompanyService_1.default({ Data, Id });
    return res.status(200).json(user);
});
exports.update = update;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const Data = req.body;
    const user = yield CreateCompanyService_1.default({ Data });
    return res.status(200).json(user);
});
exports.create = create;
const externaCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Data = req.body;
    const user = yield CreateCompanyExternalService_1.default({ Data });
    return res.status(200).json(user);
});
exports.externaCreate = externaCreate;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { Id } = req.params;
    yield DeleteCompanyService_1.default(Id);
    return res.status(200).json({ message: "Company deleted" });
});
exports.remove = remove;
