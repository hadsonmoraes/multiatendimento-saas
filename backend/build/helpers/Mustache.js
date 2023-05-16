"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hour = exports.date = exports.control = exports.msgsd = void 0;
const mustache_1 = __importDefault(require("mustache"));
const msgsd = () => {
    let ms = "";
    const hh = new Date().getHours();
    if (hh >= 6) {
        ms = "Bom dia";
    }
    if (hh > 11) {
        ms = "Boa tarde";
    }
    if (hh > 17) {
        ms = "Boa noite";
    }
    if (hh > 23 || hh < 6) {
        ms = "Boa madrugada";
    }
    return ms;
};
exports.msgsd = msgsd;
const control = () => {
    const Hr = new Date();
    const dd = ("0" + Hr.getDate()).slice(-2);
    const mm = ("0" + (Hr.getMonth() + 1)).slice(-2);
    const yy = Hr.getFullYear().toString();
    const ctrl = yy + mm + dd + "T";
    return ctrl;
};
exports.control = control;
const date = () => {
    const Hr = new Date();
    const dd = ("0" + Hr.getDate()).slice(-2);
    const mm = ("0" + (Hr.getMonth() + 1)).slice(-2);
    const yy = Hr.getFullYear().toString();
    const dates = dd + "-" + mm + "-" + yy;
    return dates;
};
exports.date = date;
const hour = () => {
    const Hr = new Date();
    const hh = Hr.getHours();
    const min = ("0" + Hr.getMinutes()).slice(-2);
    const ss = ("0" + Hr.getSeconds()).slice(-2);
    const hours = hh + ":" + min + ":" + ss;
    return hours;
};
exports.hour = hour;
exports.default = (body, ticket) => {
    var _a;
    let nameContact = ticket ? ticket.contact.name : "";
    if (nameContact !== '')
        nameContact = nameContact.replace("&amp;", "&");
    const view = {
        name: nameContact,
        ticket_id: ticket ? ticket.id : "",
        ms: exports.msgsd(),
        hour: exports.hour(),
        date: exports.date(),
        queue: ticket ? (_a = ticket === null || ticket === void 0 ? void 0 : ticket.queue) === null || _a === void 0 ? void 0 : _a.name : "",
        connection: ticket ? ticket.whatsapp.name : "",
        protocol: new Array(exports.control(), ticket ? ticket.id.toString() : "").join(""),
    };
    return mustache_1.default.render(body, view);
};
