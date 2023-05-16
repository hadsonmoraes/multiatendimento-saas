"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const bcryptjs_1 = require("bcryptjs");
let Company = class Company extends sequelize_typescript_1.Model {
    constructor() {
        super(...arguments);
        this.checkPassword = (password) => __awaiter(this, void 0, void 0, function* () {
            return bcryptjs_1.compare(password, this.getDataValue("passwordDefault"));
        });
    }
};
Company.hashPassword = (instance) => __awaiter(void 0, void 0, void 0, function* () {
    var has = yield bcryptjs_1.hash(instance.passwordDefault, 8);
    console.info('Oiiii', has);
    if (instance.passwordDefault) {
        instance.passwordDefault = has;
    }
});
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Company.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Company.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Company.prototype, "passwordDefault", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Company.prototype, "numberAttendants", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Company.prototype, "numberConections", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Company.prototype, "numberSetores", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Company.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Company.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Company.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Object)
], Company, "hashPassword", void 0);
Company = __decorate([
    sequelize_typescript_1.Table
], Company);
exports.default = Company;
