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
exports.ValidAndTransferTicket = exports.FindOrCreateTicketService = exports.OnlyFindTicketService = void 0;
const date_fns_1 = require("date-fns");
const sequelize_1 = require("sequelize");
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const logger_1 = require("../../utils/logger");
const ListSettingByValueService_1 = __importDefault(require("../SettingServices/ListSettingByValueService"));
const ShowTicketService_1 = __importDefault(require("./ShowTicketService"));
const OnlyFindTicketService = (contact, whatsappId, groupContact, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('Only searching a ticket existing to contact ' + contact.number + ' in business: ' + companyId);
    let ticket;
    ticket = yield Ticket_1.default.findOne({
        where: {
            companyId: companyId,
            status: {
                [sequelize_1.Op.or]: ["open", "pending"]
            },
            contactId: groupContact ? groupContact.id : contact.id,
            whatsappId: whatsappId
        }
    });
    if (!ticket && groupContact) {
        ticket = yield Ticket_1.default.findOne({
            where: {
                companyId: companyId,
                contactId: groupContact.id,
                whatsappId: whatsappId
            },
            order: [["updatedAt", "DESC"]]
        });
    }
    if (!ticket && !groupContact) {
        const timeCreateNewTicket = yield ListSettingByValueService_1.default('timeCreateNewTicket', Number(companyId));
        ticket = yield Ticket_1.default.findOne({
            where: {
                companyId: companyId,
                updatedAt: {
                    [sequelize_1.Op.between]: [+date_fns_1.subSeconds(new Date(), Number(timeCreateNewTicket)), +new Date()]
                },
                contactId: contact.id,
                whatsappId: whatsappId
            },
            order: [["updatedAt", "DESC"]]
        });
    }
    if (ticket && (ticket === null || ticket === void 0 ? void 0 : ticket.companyId)) {
        ticket = yield ShowTicketService_1.default(ticket.id, ticket === null || ticket === void 0 ? void 0 : ticket.companyId);
    }
    return ticket;
});
exports.OnlyFindTicketService = OnlyFindTicketService;
const FindOrCreateTicketService = (contact, whatsappId, unreadMessages, groupContact, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('Searching or creating a ticket existing to contact ' + contact.number + ' in business: ' + companyId);
    let ticket = yield Ticket_1.default.findOne({
        where: {
            companyId: companyId,
            status: {
                [sequelize_1.Op.or]: ["open", "pending"]
            },
            contactId: groupContact ? groupContact.id : contact.id,
            whatsappId: whatsappId
        }
    });
    if (ticket) {
        logger_1.logger.warn('Ticket found the ticketId ' + ticket.id + ', status ' + ticket.status + ' and business: ' + ticket.companyId);
        yield ticket.update({ unreadMessages });
    }
    if (!ticket && groupContact) {
        logger_1.logger.warn('Ticket now not found, verify if is group contact in business: ' + companyId);
        ticket = yield Ticket_1.default.findOne({
            where: {
                companyId: companyId,
                contactId: groupContact.id,
                whatsappId: whatsappId
            },
            order: [["updatedAt", "DESC"]]
        });
        if (ticket) {
            logger_1.logger.warn('Ticket found 2x the ticketId ' + ticket.id + ', status ' + ticket.status + ' and business: ' + ticket.companyId);
            logger_1.logger.info('Updating to status pending and userId is null...');
            yield ticket.update({
                status: "pending",
                userId: null,
                unreadMessages
            });
        }
    }
    if (!ticket && !groupContact) {
        logger_1.logger.warn('Here ticket not found old and not found group contacts...');
        const timeCreateNewTicket = yield ListSettingByValueService_1.default('timeCreateNewTicket', Number(companyId));
        ticket = yield Ticket_1.default.findOne({
            where: {
                companyId: companyId,
                updatedAt: {
                    [sequelize_1.Op.between]: [+date_fns_1.subSeconds(new Date(), Number(timeCreateNewTicket === null || timeCreateNewTicket === void 0 ? void 0 : timeCreateNewTicket.value)), +new Date()]
                },
                contactId: contact.id,
                whatsappId: whatsappId
            },
            order: [["updatedAt", "DESC"]]
        });
        if (ticket) {
            logger_1.logger.info('Here is updating ticket to status pending...');
            yield ticket.update({
                status: "pending",
                userId: null,
                unreadMessages
            });
        }
    }
    if (!ticket) {
        logger_1.logger.warn('A ticket not found, searching by WhatsApp with business: ' + companyId);
        let whatsapp = yield Whatsapp_1.default.findOne({
            where: {
                companyId: companyId,
                id: whatsappId
            }
        });
        let setContactId;
        if (groupContact) {
            setContactId = groupContact.id;
        }
        else {
            setContactId = contact.id;
        }
        logger_1.logger.warn('Creting a new ticket to contact ' + setContactId + ' and business set with data for whatsapp is: ' + (whatsapp === null || whatsapp === void 0 ? void 0 : whatsapp.companyId));
        ticket = yield Ticket_1.default.create({
            contactId: setContactId,
            status: "pending",
            isGroup: !!groupContact,
            unreadMessages,
            whatsappId,
            companyId: whatsapp === null || whatsapp === void 0 ? void 0 : whatsapp.companyId
        });
    }
    let ticket_all = yield Ticket_1.default.findAll({
        where: {
            companyId: companyId,
            status: {
                [sequelize_1.Op.or]: ["open", "pending"]
            },
            id: { [sequelize_1.Op.not]: ticket.id },
            contactId: groupContact ? groupContact.id : contact.id,
            whatsappId: whatsappId
        }
    }).then((result) => {
        if (result) {
            result.forEach(function (r) {
                r.update({ status: 'close' });
                r.save();
            });
        }
    });
    ticket = yield ShowTicketService_1.default(ticket.id, ticket.companyId);
    return ticket;
});
exports.FindOrCreateTicketService = FindOrCreateTicketService;
const ValidAndTransferTicket = (ticketId, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('Validating data to auto ticket transfer with status pending in business: ' + companyId);
    let ticket;
    const afterMinutesToTransfer = yield ListSettingByValueService_1.default('afterMinutesToTransfer', Number(companyId));
    const departmentToTransfer = yield ListSettingByValueService_1.default('afterMinutesTicketWithoutDepartmentTransferTo', Number(companyId));
    const Seconds = Number(afterMinutesToTransfer === null || afterMinutesToTransfer === void 0 ? void 0 : afterMinutesToTransfer.value);
    const deptoTo = Number(departmentToTransfer === null || departmentToTransfer === void 0 ? void 0 : departmentToTransfer.value);
    if (Seconds > 0 && deptoTo > 0) {
        ticket = yield Ticket_1.default.findAll({
            where: {
                companyId: companyId,
                status: {
                    [sequelize_1.Op.eq]: 'pending'
                },
                queueId: {
                    [sequelize_1.Op.eq]: null,
                },
                [sequelize_1.Op.and]: [
                    sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('timestampdiff', sequelize_1.Sequelize.literal('SECOND'), sequelize_1.Sequelize.fn('timestampadd', sequelize_1.Sequelize.literal('SECOND'), Seconds, sequelize_1.Sequelize.col('updatedAt')), sequelize_1.Sequelize.fn('current_timestamp')), '>', Seconds)
                ],
            },
            order: [["updatedAt", "DESC"]]
        });
        if (ticket && ticket.length !== 0) {
            logger_1.logger.info('Updating ' + ticket.length + ' ticket`s to status pending and transfering ticket`s to queueId: ' + deptoTo);
            yield Ticket_1.default.update({
                status: "pending",
                queueId: deptoTo,
                userId: null
            }, {
                where: {
                    companyId: companyId,
                    status: {
                        [sequelize_1.Op.eq]: 'pending'
                    },
                    queueId: {
                        [sequelize_1.Op.eq]: null,
                    },
                    [sequelize_1.Op.and]: [
                        sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('timestampdiff', sequelize_1.Sequelize.literal('SECOND'), sequelize_1.Sequelize.fn('timestampadd', sequelize_1.Sequelize.literal('SECOND'), Seconds, sequelize_1.Sequelize.col('updatedAt')), sequelize_1.Sequelize.fn('current_timestamp')), '>', Seconds)
                    ],
                }
            });
        }
    }
    if (Number(ticketId) > 0 && ticketId !== undefined)
        ticket = yield Ticket_1.default.findByPk(ticketId);
    return ticket ? ticket : undefined;
});
exports.ValidAndTransferTicket = ValidAndTransferTicket;
