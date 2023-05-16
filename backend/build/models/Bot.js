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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = __importDefault(require("./User"));
const Queue_1 = __importDefault(require("./Queue"));
let Bot = class Bot extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Bot.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Bot.prototype, "commandBot", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Bot.prototype, "commandType", void 0);
__decorate([
    sequelize_typescript_1.Default(null),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Bot.prototype, "descriptionBot", void 0);
__decorate([
    sequelize_typescript_1.Default(null),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Bot.prototype, "showMessage", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => User_1.default),
    sequelize_typescript_1.Default(null),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Bot.prototype, "userId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.default),
    __metadata("design:type", User_1.default)
], Bot.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Bot.prototype, "companyId", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Queue_1.default),
    sequelize_typescript_1.Default(null),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Bot.prototype, "queueId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Queue_1.default),
    __metadata("design:type", Queue_1.default)
], Bot.prototype, "queue", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Bot.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Bot.prototype, "updatedAt", void 0);
Bot = __decorate([
    sequelize_typescript_1.Table
], Bot);
exports.default = Bot;
