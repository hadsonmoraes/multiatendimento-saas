"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SerializeWbotMsgId = (ticket, message) => {
    let SeGrupo = 'g.us_' + message.id + '_' + message.contact.number + '@c.us';
    let SeIndiv = 'c.us_' + message.id;
    const serializedMsgId = `${message.fromMe}_${ticket.contact.number}@${ticket.isGroup ? SeGrupo : SeIndiv}`;
    return serializedMsgId;
};
exports.default = SerializeWbotMsgId;
