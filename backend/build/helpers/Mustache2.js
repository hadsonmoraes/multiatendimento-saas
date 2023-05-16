"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mustache_1 = __importDefault(require("mustache"));
exports.default = (body, contact) => {
    let ms = "";
    const Hr = new Date();
    const dd = ("0" + Hr.getDate()).slice(-2);
    const mm = ("0" + (Hr.getMonth() + 1)).slice(-2);
    const yy = Hr.getFullYear().toString();
    const hh = Hr.getHours();
    const min = ("0" + Hr.getMinutes()).slice(-2);
    const ss = ("0" + Hr.getSeconds()).slice(-2);
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
    let protocol = yy + mm + dd + String(hh) + min + ss;
    let hora = hh + ":" + min + ":" + ss;
    const view = {
        name: contact ? contact.name : "",
        ms: ms,
        protocol: protocol,
        hora: hora,
    };
    return mustache_1.default.render(body, view);
};
