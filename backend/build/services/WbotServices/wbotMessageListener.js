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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessage = exports.wbotMessageListener = void 0;
const path_1 = require("path");
const util_1 = require("util");
const fs_1 = require("fs");
const Sentry = __importStar(require("@sentry/node"));
const Message_1 = __importDefault(require("../../models/Message"));
const Setting_1 = __importDefault(require("../../models/Setting"));
const socket_1 = require("../../libs/socket");
const CreateMessageService_1 = __importDefault(require("../MessageServices/CreateMessageService"));
const logger_1 = require("../../utils/logger");
const CreateOrUpdateContactService_1 = __importDefault(require("../ContactServices/CreateOrUpdateContactService"));
const FindOrCreateTicketService_1 = require("../TicketServices/FindOrCreateTicketService");
const ShowWhatsAppService_1 = __importDefault(require("../WhatsappService/ShowWhatsAppService"));
const Debounce_1 = require("../../helpers/Debounce");
const UpdateTicketService_1 = __importDefault(require("../TicketServices/UpdateTicketService"));
const CreateContactService_1 = __importDefault(require("../ContactServices/CreateContactService"));
const ShowBotsService_1 = __importDefault(require("../WhatsappService/ShowBotsService"));
const UpdateCommandService_1 = __importDefault(require("../ContactServices/UpdateCommandService"));
const GetCommandService_1 = __importDefault(require("../ContactServices/GetCommandService"));
const ShowMenu_1 = __importDefault(require("../../helpers/ShowMenu"));
const MenuBots_1 = require("../BotServices/MenuBots");
const Mustache_1 = __importDefault(require("../../helpers/Mustache"));
const ListSettingByValueService_1 = __importDefault(require("../SettingServices/ListSettingByValueService"));
const ListSettingsServiceOne_1 = __importDefault(require("../SettingServices/ListSettingsServiceOne"));
const writeFileAsync = util_1.promisify(fs_1.writeFile);
const verifyContact = (msgContact, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('Searching or updating contact in database the business: ' + companyId);
    try {
        let profilePicUrl = yield msgContact.getProfilePicUrl();
        if (!profilePicUrl)
            profilePicUrl = "/default-profile.png"; // Foto de perfil padrão
        const contactData = {
            name: msgContact.name || msgContact.pushname || msgContact.id.user,
            number: msgContact.id.user,
            profilePicUrl,
            isGroup: msgContact.isGroup,
            companyId: companyId
        };
        const contact = CreateOrUpdateContactService_1.default(contactData);
        return contact;
    }
    catch (err) {
        const profilePicUrl = "/default-profile.png"; // Foto de perfil padrão
        const contactData = {
            name: msgContact.name || msgContact.pushname || msgContact.id.user,
            number: msgContact.id.user,
            profilePicUrl,
            isGroup: msgContact.isGroup,
            companyId: companyId
        };
        const contact = CreateOrUpdateContactService_1.default(contactData);
        return contact;
    }
});
const verifyCommand = (msgContact, command, companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const contactData = {
        number: msgContact.id.user,
        isGroup: msgContact.isGroup,
        commandBot: command,
        companyId: companyId
    };
    logger_1.logger.info('Verify and updating command ' + command + ' in ' + msgContact.id.user + ' in business: ' + companyId);
    const contact = UpdateCommandService_1.default(contactData);
    return contact;
});
const verifyQuotedMessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (!msg.hasQuotedMsg)
        return null;
    const wbotQuotedMsg = yield msg.getQuotedMessage();
    const quotedMsg = yield Message_1.default.findOne({
        where: { id: wbotQuotedMsg.id.id }
    });
    if (!quotedMsg)
        return null;
    return quotedMsg;
});
const verifyRevoked = (msgBody) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise(r => setTimeout(r, 500));
    const io = socket_1.getIO();
    if (msgBody === undefined) {
        return;
    }
    try {
        const message = yield Message_1.default.findOne({
            where: {
                body: msgBody
            }
        });
        if (!message) {
            return;
        }
        if (message) {
            // console.log(message);
            yield Message_1.default.update({ isDeleted: true }, {
                where: { id: message.id }
            });
            const msgIsDeleted = yield Message_1.default.findOne({
                where: {
                    body: msgBody
                }
            });
            if (!msgIsDeleted) {
                return;
            }
            io.to(msgIsDeleted.ticketId.toString()).emit("appMessage", {
                action: "update",
                message: msgIsDeleted
            });
        }
    }
    catch (err) {
        Sentry.captureException(err);
        logger_1.logger.error(`Error Message Revoke. Err: ${err}`);
    }
});
function makeRandomId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
const verifyMediaMessage = (msg, ticket, contact) => __awaiter(void 0, void 0, void 0, function* () {
    const quotedMsg = yield verifyQuotedMessage(msg);
    const media = yield msg.downloadMedia();
    let randomId = makeRandomId(5);
    if (!media) {
        throw new Error("ERR_WAPP_DOWNLOAD_MEDIA");
    }
    /* Check if media not have a filename
      if (!media.filename) {
        const ext = media.mimetype.split("/")[1].split(";")[0];
        media.filename = `${new Date().getTime()}.${ext}`;
      }
    */
    if (!media.filename) {
        let originalFilename = media.filename ? `-${media.filename}` : '';
        // Always write a random filename
        const ext = media.mimetype.split("/")[1].split(";")[0];
        media.filename = `${new Date().getTime()}${originalFilename}.${ext}`;
    }
    else {
        media.filename = media.filename.split('.').slice(0, -1).join('.') + '.' + randomId + '.' + media.filename.split('.').slice(-1);
    }
    try {
        yield writeFileAsync(path_1.join(__dirname, "..", "..", "..", "public", media.filename), media.data, "base64");
    }
    catch (err) {
        Sentry.captureException(err);
        logger_1.logger.error(err);
    }
    const messageData = {
        id: msg.id.id,
        ticketId: ticket.id,
        contactId: msg.fromMe ? undefined : contact.id,
        body: msg.body || media.filename,
        fromMe: msg.fromMe,
        read: msg.fromMe,
        mediaUrl: media.filename,
        mediaType: media.mimetype.split("/")[0],
        quotedMsgId: quotedMsg === null || quotedMsg === void 0 ? void 0 : quotedMsg.id,
        companyId: ticket.companyId
    };
    yield ticket.update({ lastMessage: msg.body || media.filename });
    const newMessage = yield CreateMessageService_1.default({ messageData, companyId: ticket.companyId });
    return newMessage;
});
const verifyMessage = (msg, ticket, contact) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('Validating message to delivery in ' + contact.number + ' and business: ' + ticket.companyId);
    if (msg.type === 'location')
        msg = prepareLocation(msg);
    const quotedMsg = yield verifyQuotedMessage(msg);
    const messageData = {
        id: msg.id.id,
        ticketId: ticket.id,
        contactId: msg.fromMe ? undefined : contact.id,
        body: msg.body,
        fromMe: msg.fromMe,
        mediaType: msg.type,
        read: msg.fromMe,
        quotedMsgId: quotedMsg === null || quotedMsg === void 0 ? void 0 : quotedMsg.id,
        companyId: ticket.companyId
    };
    yield ticket.update({
        lastMessage: msg.type === "location" ?
            msg.location.description ? "Localization - " +
                msg.location.description.split('\\n')[0] : "Localization" : msg.body
    });
    yield CreateMessageService_1.default({ messageData, companyId: ticket.companyId });
});
const prepareLocation = (msg) => {
    let gmapsUrl = "https://maps.google.com/maps?q=" + msg.location.latitude + "%2C" + msg.location.longitude + "&z=17&hl=pt-BR";
    msg.body = "data:image/png;base64," + msg.body + "|" + gmapsUrl;
    msg.body += "|" + (msg.location.description ? msg.location.description : (msg.location.latitude + ", " + msg.location.longitude));
    return msg;
};
const verifyQueue = (wbot, msg, ticket, contact) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('Starting search by queues the user and connection in business: ' + ticket.companyId);
    const { queues, greetingMessage } = yield ShowWhatsAppService_1.default(wbot.id);
    if (queues.length === 1) {
        const deptoIsOpen = yield validaHorarioFuncionamento(wbot, msg, ticket, contact, queues[0].id.toString());
        if (deptoIsOpen !== true)
            return;
        logger_1.logger.warn('Self defining only one queue found');
        yield UpdateTicketService_1.default({
            ticketData: { queueId: queues[0].id },
            ticketId: ticket.id,
            companyId: ticket.companyId
        });
        return;
    }
    const selectedOption = msg.body;
    const choosenQueue = queues[+selectedOption - 1];
    if (choosenQueue) {
        const deptoIsOpen = yield validaHorarioFuncionamento(wbot, msg, ticket, contact, choosenQueue.id.toString());
        if (deptoIsOpen !== true)
            return;
        const chat = yield msg.getChat();
        yield chat.sendStateTyping();
        yield UpdateTicketService_1.default({
            ticketData: { queueId: choosenQueue.id },
            ticketId: ticket.id,
            companyId: ticket.companyId
        });
        if (choosenQueue.greetingMessage !== '') {
            const body = Mustache_1.default(`\u200e${choosenQueue.greetingMessage}`, ticket);
            const sentMessage = yield wbot.sendMessage(`${contact.number}@c.us`, body);
            yield verifyMessage(sentMessage, ticket, contact);
        }
    }
    else {
        let options = "";
        const chat = yield msg.getChat();
        yield chat.sendStateTyping();
        queues.forEach((queue, index) => {
            options += `*${index + 1}* - ${queue.name}\n`;
        });
        const body = Mustache_1.default(`\u200e${greetingMessage}\n${options}`, ticket);
        const debouncedSentMessage = Debounce_1.debounce(() => __awaiter(void 0, void 0, void 0, function* () {
            const sentMessage = yield wbot.sendMessage(`${contact.number}@c.us`, body);
            verifyMessage(sentMessage, ticket, contact);
        }), 3000, ticket.id);
        debouncedSentMessage();
    }
});
const validaHorarioFuncionamento = (wbot, msg, ticket, contact, queueId) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.warn('Validating office hours to queueId ' + queueId + ' in business ' + ticket.companyId);
    if (queueId === undefined || queueId === '')
        return true;
    const { queues } = yield ShowWhatsAppService_1.default(wbot.id);
    const choosenQueue = queues.find(item => item.id.toString() === queueId);
    if (choosenQueue && choosenQueue.startWork && choosenQueue.endWork) {
        const Hr = new Date();
        const hh = Hr.getHours() * 60 * 60;
        const mm = Hr.getMinutes() * 60;
        const hora = hh + mm;
        const inicio = choosenQueue.startWork;
        const hhinicio = Number(inicio.split(':')[0]) * 60 * 60;
        const mminicio = Number(inicio.split(':')[1]) * 60;
        const horainicio = hhinicio + mminicio;
        const termino = choosenQueue.endWork;
        const hhtermino = Number(termino.split(':')[0]) * 60 * 60;
        const mmtermino = Number(termino.split(':')[1]) * 60;
        const horatermino = hhtermino + mmtermino;
        if ((hora < horainicio) || (hora > horatermino)) {
            const chat = yield msg.getChat();
            yield chat.sendStateTyping();
            const body = Mustache_1.default(`\u200e${choosenQueue.absenceMessage}`, ticket);
            const debouncedSentMessage = Debounce_1.debounce(() => __awaiter(void 0, void 0, void 0, function* () {
                const sentMessage = yield wbot.sendMessage(`${contact.number}@c.us`, body);
                verifyMessage(sentMessage, ticket, contact);
            }), 3000, ticket.id);
            debouncedSentMessage();
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
});
const verifyBots = (wbot, msg, ticket, contact) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('Validating the existence of a bot controller for the business: ' + ticket.companyId);
    const bots = yield ShowBotsService_1.default(ticket.companyId);
    const { greetingMessage } = yield ShowWhatsAppService_1.default(wbot.id);
    if (bots.length === 0) {
        return bots.length;
    }
    const commandContact = yield msg.getContact();
    const lastCommand = yield GetCommandService_1.default(contact.number, ticket.companyId); // essa linha não atualiza o comando, apenas busca o comando salvo no contato
    const selectedOption = (lastCommand === null || lastCommand === void 0 ? void 0 : lastCommand.commandBot) ? (lastCommand === null || lastCommand === void 0 ? void 0 : lastCommand.commandBot) + '.' + msg.body : msg.body;
    const choosenBot = bots.find(bot => bot.commandBot === selectedOption);
    if (choosenBot) {
        let body = '';
        switch (choosenBot.commandType) {
            case 1: // INFORMATIVO
                body = `\u200e${choosenBot.showMessage}`;
                yield verifyCommand(commandContact, "", choosenBot.companyId);
                break;
            case 2: // MENU
                body = `\u200e${ShowMenu_1.default(selectedOption, bots)}`;
                yield verifyCommand(commandContact, choosenBot.commandBot, choosenBot.companyId);
                break;
            case 3: // SETOR
                const deptoIsOpen = yield validaHorarioFuncionamento(wbot, msg, ticket, contact, choosenBot.queueId.toString());
                if (deptoIsOpen === true) {
                    body = `\u200e${choosenBot.showMessage}`;
                    yield verifyCommand(commandContact, choosenBot.commandBot, choosenBot.companyId);
                    yield UpdateTicketService_1.default({
                        ticketData: { queueId: choosenBot.queueId },
                        ticketId: ticket.id,
                        companyId: choosenBot.companyId
                    });
                }
                break;
            case 4: // ATENDENTE
                body = `\u200e${choosenBot.showMessage}`;
                yield verifyCommand(commandContact, choosenBot.commandBot, choosenBot.companyId);
                yield UpdateTicketService_1.default({
                    ticketData: { userId: choosenBot.userId },
                    ticketId: ticket.id,
                    companyId: choosenBot.companyId
                });
                break;
        }
        if (body !== '') {
            const chat = yield msg.getChat();
            yield chat.sendStateTyping();
            body = Mustache_1.default(`\u200e${body}`, ticket);
            const sentMessage = yield wbot.sendMessage(`${contact.number}@c.us`, body);
            yield verifyMessage(sentMessage, ticket, contact);
            return 1;
        }
    }
    else {
        if (lastCommand === null || lastCommand === void 0 ? void 0 : lastCommand.commandBot) { // já está em atendimento, NÃO mostrar o menu novamente!
            return true;
        }
        const chat = yield msg.getChat();
        yield chat.sendStateTyping();
        let options = yield MenuBots_1.ConstructMenu(ticket.companyId);
        const body = Mustache_1.default(`\u200e${greetingMessage}\n\n${options}`, ticket);
        const debouncedSentMessage = Debounce_1.debounce(() => __awaiter(void 0, void 0, void 0, function* () {
            const sentMessage = yield wbot.sendMessage(`${contact.number}@c.us`, body);
            verifyMessage(sentMessage, ticket, contact);
            // return 1;
        }), 3000, ticket.id);
        debouncedSentMessage();
    }
});
const isValidMsg = (msg) => {
    if (msg.from === "status@broadcast")
        return false;
    if (msg.type === "chat" ||
        msg.type === "audio" ||
        msg.type === "call_log" ||
        msg.type === "ptt" ||
        msg.type === "video" ||
        msg.type === "image" ||
        msg.type === "document" ||
        msg.type === "vcard" ||
        //msg.type === "multi_vcard" ||
        msg.type === "sticker" ||
        msg.type === "e2e_notification" || // Ignore Empty Messages Generated When Someone Changes His Account from Personal to Business or vice-versa
        msg.type === "notification_template" || // Ignore Empty Messages Generated When Someone Changes His Account from Personal to Business or vice-versa
        msg.author != null || // Ignore Group Messages
        msg.type === "location")
        return true;
    return false;
};
const handleMessage = (msg, wbot) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    if (!isValidMsg(msg)) {
        return;
    }
    // IGNORAR MENSAGENS DE GRUPO
    const Settingdb = yield Setting_1.default.findOne({
        where: { key: "CheckMsgIsGroup" }
    });
    if ((Settingdb === null || Settingdb === void 0 ? void 0 : Settingdb.value) === "enabled") {
        const chat = yield msg.getChat();
        if (msg.type === "sticker" ||
            msg.type === "e2e_notification" ||
            msg.type === "notification_template" ||
            msg.from === "status@broadcast" ||
            msg.author != null ||
            chat.isGroup) {
            return;
        }
    }
    // IGNORAR MENSAGENS DE GRUPO
    let ticket;
    try {
        let msgContact;
        let groupContact;
        if (msg.fromMe) {
            // messages sent automatically by wbot have a special character in front of it
            // if so, this message was already been stored in database;
            if (/\u200e/.test(msg.body[0]))
                return;
            // media messages sent from me from cell phone, first comes with "hasMedia = false" and type = "image/ptt/etc"
            // in this case, return and let this message be handled by "media_uploaded" event, when it will have "hasMedia = true"
            if (!msg.hasMedia && msg.type !== "location" && msg.type !== "chat" && msg.type !== "vcard"
            //&& msg.type !== "multi_vcard"
            )
                return;
            msgContact = yield wbot.getContactById(msg.to);
        }
        else {
            msgContact = yield msg.getContact();
            const listSettingsService = yield ListSettingsServiceOne_1.default({ key: "call" });
            var callSetting = listSettingsService === null || listSettingsService === void 0 ? void 0 : listSettingsService.value;
        }
        const chat = yield msg.getChat();
        const whatsapp = yield ShowWhatsAppService_1.default(wbot.id);
        let howCompanyId = whatsapp.companyId;
        logger_1.logger.info('Reading and validating the message for the business: ' + howCompanyId);
        if (chat.isGroup) {
            let msgGroupContact;
            logger_1.logger.warn('The contact is group');
            if (msg.fromMe) {
                msgGroupContact = yield wbot.getContactById(msg.to);
            }
            else {
                msgGroupContact = yield wbot.getContactById(msg.from);
            }
            groupContact = yield verifyContact(msgGroupContact, howCompanyId);
        }
        const unreadMessages = msg.fromMe ? 0 : chat.unreadCount;
        const contact = yield verifyContact(msgContact, howCompanyId);
        ticket = yield FindOrCreateTicketService_1.OnlyFindTicketService(contact, wbot.id, groupContact, howCompanyId);
        howCompanyId = (ticket === null || ticket === void 0 ? void 0 : ticket.companyId) ? ticket === null || ticket === void 0 ? void 0 : ticket.companyId : howCompanyId;
        if (ticket &&
            (unreadMessages === 0 &&
                whatsapp.farewellMessage &&
                Mustache_1.default(whatsapp.farewellMessage, ticket).trim() === msg.body.trim())) {
            return;
        }
        const ticketTransf = yield FindOrCreateTicketService_1.ValidAndTransferTicket(ticket === null || ticket === void 0 ? void 0 : ticket.id, howCompanyId);
        if (ticketTransf && ticketTransf !== undefined)
            ticket = ticketTransf;
        ticket = yield FindOrCreateTicketService_1.FindOrCreateTicketService(contact, wbot.id, unreadMessages, groupContact, howCompanyId);
        yield verifyContact(msgContact, howCompanyId);
        if (msg.hasMedia) {
            yield verifyMediaMessage(msg, ticket, contact);
        }
        else {
            yield verifyMessage(msg, ticket, contact);
        }
        if (!ticket.queue &&
            !chat.isGroup &&
            !msg.fromMe &&
            !ticket.userId &&
            whatsapp.queues.length >= 1) {
            const useBotByQueue = yield ListSettingByValueService_1.default('useBotByQueueSample', howCompanyId);
            logger_1.logger.warn('The result about using controller bot per queue is: ' + (useBotByQueue === null || useBotByQueue === void 0 ? void 0 : useBotByQueue.value));
            if ((useBotByQueue === null || useBotByQueue === void 0 ? void 0 : useBotByQueue.value) === 'disabled') {
                logger_1.logger.warn('> Starting multilevel bot search...');
                yield verifyBots(wbot, msg, ticket, contact);
            }
            else {
                logger_1.logger.warn('> Starting search by queue legacy bot...');
                yield verifyQueue(wbot, msg, ticket, contact);
            }
        }
        if (msg.type === "vcard") {
            try {
                const array = msg.body.split("\n");
                const obj = [];
                let contact = "";
                for (let index = 0; index < array.length; index++) {
                    const v = array[index];
                    const values = v.split(":");
                    for (let ind = 0; ind < values.length; ind++) {
                        if (values[ind].indexOf("+") !== -1) {
                            obj.push({ number: values[ind] });
                        }
                        if (values[ind].indexOf("FN") !== -1) {
                            contact = values[ind + 1];
                        }
                    }
                }
                try {
                    for (var obj_1 = __asyncValues(obj), obj_1_1; obj_1_1 = yield obj_1.next(), !obj_1_1.done;) {
                        const ob = obj_1_1.value;
                        const cont = yield CreateContactService_1.default({
                            name: contact,
                            number: ob.number.replace(/\D/g, ""),
                            companyId: ticket.companyId
                        });
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (obj_1_1 && !obj_1_1.done && (_a = obj_1.return)) yield _a.call(obj_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        /* if (msg.type === "multi_vcard") {
          try {
            const array = msg.vCards.toString().split("\n");
            let name = "";
            let number = "";
            const obj = [];
            const conts = [];
            for (let index = 0; index < array.length; index++) {
              const v = array[index];
              const values = v.split(":");
              for (let ind = 0; ind < values.length; ind++) {
                if (values[ind].indexOf("+") !== -1) {
                  number = values[ind];
                }
                if (values[ind].indexOf("FN") !== -1) {
                  name = values[ind + 1];
                }
                if (name !== "" && number !== "") {
                  obj.push({
                    name,
                    number
                  });
                  name = "";
                  number = "";
                }
              }
            }
    
            // eslint-disable-next-line no-restricted-syntax
            for await (const ob of obj) {
              try {
                const cont = await CreateContactService({
                  name: ob.name,
                  number: ob.number.replace(/\D/g, "")
                });
                conts.push({
                  id: cont.id,
                  name: cont.name,
                  number: cont.number
                });
              } catch (error) {
                if (error.message === "ERR_DUPLICATED_CONTACT") {
                  const cont = await GetContactService({
                    name: ob.name,
                    number: ob.number.replace(/\D/g, ""),
                    email: ""
                  });
                  conts.push({
                    id: cont.id,
                    name: cont.name,
                    number: cont.number
                  });
                }
              }
            }
            msg.body = JSON.stringify(conts);
          } catch (error) {
            console.log(error);
          }
        } */
        if (msg.type === "call_log" && callSetting === "disabled") {
            const sentMessage = yield wbot.sendMessage(`${contact.number}@c.us`, "*Mensagem Automática:*\nAs chamadas de voz e vídeo estão desabilitas para esse WhatsApp, favor enviar uma mensagem de texto. Obrigado");
            yield verifyMessage(sentMessage, ticket, contact);
        }
    }
    catch (err) {
        Sentry.captureException(err);
        logger_1.logger.error(`Error handling whatsapp message: Err: ${err}`);
    }
});
exports.handleMessage = handleMessage;
const handleMsgAck = (msg, ack) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise(r => setTimeout(r, 500));
    const io = socket_1.getIO();
    try {
        const messageToUpdate = yield Message_1.default.findByPk(msg.id.id, {
            include: [
                "contact",
                {
                    model: Message_1.default,
                    as: "quotedMsg",
                    include: ["contact"]
                }
            ]
        });
        if (!messageToUpdate) {
            return;
        }
        yield messageToUpdate.update({ ack });
        io.to(messageToUpdate.ticketId.toString()).emit(`appMessage-${messageToUpdate.companyId}`, {
            action: "update",
            message: messageToUpdate
        });
    }
    catch (err) {
        Sentry.captureException(err);
        logger_1.logger.error(`Error handling message ack. Err: ${err}`);
    }
});
const wbotMessageListener = (wbot) => __awaiter(void 0, void 0, void 0, function* () {
    wbot.on("message_create", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        handleMessage(msg, wbot);
    }));
    wbot.on("media_uploaded", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        handleMessage(msg, wbot);
    }));
    wbot.on("message_ack", (msg, ack) => __awaiter(void 0, void 0, void 0, function* () {
        handleMsgAck(msg, ack);
    }));
    wbot.on("message_revoke_everyone", (after, before) => __awaiter(void 0, void 0, void 0, function* () {
        const msgBody = before === null || before === void 0 ? void 0 : before.body;
        if (msgBody !== undefined) {
            verifyRevoked(msgBody || "");
        }
    }));
});
exports.wbotMessageListener = wbotMessageListener;
