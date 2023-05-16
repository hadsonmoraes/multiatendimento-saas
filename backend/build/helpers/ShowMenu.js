"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ShowMenu = (pattern, bots) => {
    // '^1\.5\.[0-9]{1,2}$'
    const array_pattern = pattern.split('.');
    let final_pattern = '^';
    array_pattern.forEach(element => {
        final_pattern += element + '\.';
    });
    final_pattern += '[0-9]{1,2}$';
    let showMenu = '\n';
    let menu = "";
    bots.forEach(bot => {
        var _a;
        menu = bot.commandType === 1 ? bot.descriptionBot :
            bot.commandType === 2 ? bot.descriptionBot :
                bot.commandType === 3 ? bot.queue.name :
                    bot.commandType === 4 ? bot.user.name :
                        'Erro';
        showMenu += ((_a = bot.commandBot.match(final_pattern)) === null || _a === void 0 ? void 0 : _a.length) == 1 ? `*${bot.commandBot.substring(bot.commandBot.lastIndexOf('.') + 1)}* - ${menu}\n` : '';
    });
    return showMenu;
};
exports.default = ShowMenu;
