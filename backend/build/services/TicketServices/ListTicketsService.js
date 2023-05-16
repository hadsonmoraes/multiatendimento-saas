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
const date_fns_1 = require("date-fns");
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const Contact_1 = __importDefault(require("../../models/Contact"));
const Message_1 = __importDefault(require("../../models/Message"));
const Queue_1 = __importDefault(require("../../models/Queue"));
const User_1 = __importDefault(require("../../models/User"));
const ShowUserService_1 = __importDefault(require("../UserServices/ShowUserService"));
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const logger_1 = require("../../utils/logger");
const ListTicketsService = ({ searchParam = "", pageNumber = "1", queueIds, status, date, showAll, userId, withUnreadMessages, companyId = -1 }) => __awaiter(void 0, void 0, void 0, function* () {
    const statusParam = status ? status : 'pending';
    logger_1.logger.warn('Requisited ticket list with status ' + statusParam + ', userId ' + userId + ' and business: ' + companyId);
    let whereCondition = {
        [sequelize_1.Op.or]: [{ userId }, { status: "pending" }],
        queueId: { [sequelize_1.Op.or]: [queueIds, null] },
        companyId: { [sequelize_1.Op.or]: [companyId, -1] }
    };
    let includeCondition;
    includeCondition = [
        {
            model: Contact_1.default,
            as: "contact",
            attributes: ["id", "name", "number", "profilePicUrl"]
        },
        {
            model: Queue_1.default,
            as: "queue",
            attributes: ["id", "name", "color"]
        },
        {
            model: Whatsapp_1.default,
            as: "whatsapp",
            attributes: ["name"]
        },
        {
            model: User_1.default,
            as: "user",
            attributes: ["name"]
        },
    ];
    if (showAll === "true") {
        whereCondition = {
            queueId: { [sequelize_1.Op.or]: [queueIds, null] },
            companyId: { [sequelize_1.Op.or]: [companyId, -1] }
        };
    }
    if (status) {
        whereCondition = Object.assign(Object.assign({}, whereCondition), { status });
    }
    if (searchParam) {
        const sanitizedSearchParam = searchParam.toLocaleLowerCase().trim();
        includeCondition = [
            ...includeCondition,
            {
                model: Message_1.default,
                as: "messages",
                attributes: ["id", "body"],
                where: {
                    body: sequelize_1.where(sequelize_1.fn("LOWER", sequelize_1.col("body")), "LIKE", `%${sanitizedSearchParam}%`)
                },
                required: false,
                duplicating: false
            }
        ];
        whereCondition = Object.assign(Object.assign({}, whereCondition), { [sequelize_1.Op.or]: [
                {
                    "$contact.name$": sequelize_1.where(sequelize_1.fn("LOWER", sequelize_1.col("contact.name")), "LIKE", `%${sanitizedSearchParam}%`)
                },
                { "$contact.number$": { [sequelize_1.Op.like]: `%${sanitizedSearchParam}%` } },
                {
                    "$message.body$": sequelize_1.where(sequelize_1.fn("LOWER", sequelize_1.col("body")), "LIKE", `%${sanitizedSearchParam}%`)
                }
            ] });
    }
    if (date) {
        const dateParse = date_fns_1.parseISO(date);
        whereCondition = {
            companyId: companyId ? companyId : -1,
            createdAt: {
                [sequelize_1.Op.between]: [date_fns_1.startOfDay(dateParse), date_fns_1.endOfDay(dateParse)],
            }
        };
    }
    if (withUnreadMessages === "true") {
        const user = yield ShowUserService_1.default(userId);
        const userQueueIds = user.queues.map(queue => queue.id);
        whereCondition = {
            [sequelize_1.Op.or]: [{ userId }, { status: "pending" }],
            queueId: { [sequelize_1.Op.or]: [userQueueIds, null] },
            unreadMessages: { [sequelize_1.Op.gt]: 0 }
        };
    }
    const limit = 50;
    const offset = limit * (+pageNumber - 1);
    const { count, rows: tickets } = yield Ticket_1.default.findAndCountAll({
        where: whereCondition,
        include: includeCondition,
        distinct: true,
        limit,
        offset,
        order: [["updatedAt", "DESC"]]
    });
    const hasMore = count > offset + tickets.length;
    return {
        tickets,
        count,
        hasMore
    };
});
exports.default = ListTicketsService;
