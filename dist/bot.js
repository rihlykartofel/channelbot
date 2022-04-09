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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const sequelize_1 = require("sequelize");
const UserChat_model_1 = require("./database/models/UserChat.model");
// Create an instance of the `Bot` class and pass your authentication token to it.
const bot = new grammy_1.Bot("5110816886:AAF8wLylhLQpyVPZxjKE6Hm8frrj4lZwNVg"); // <-- put your authentication token between the ""
// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.
// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
// bot.on("message", (ctx) => ctx.reply("Got another message!"));
bot.command("add_channel", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const chatNickname = (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.text.split(' ', 2)[1];
    if (!chatNickname) {
        ctx.reply('Wrong channel name');
        return;
    }
    if (!(/^@[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*$/.test(chatNickname))) {
        ctx.reply('Wrong channel name');
        return;
    }
    const chat = yield ctx.api.getChat(chatNickname);
    if (chat.type != 'channel') {
        ctx.reply('Wrong channel type');
        return;
    }
    const userId = (_c = ctx.from) === null || _c === void 0 ? void 0 : _c.id;
    const chatId = chat.id;
    if (!userId) {
        ctx.reply('Wrong author');
        return;
    }
    let chatMember;
    try {
        chatMember = yield ctx.api.getChatMember(chat.id, userId);
        if (chatMember.status != 'administrator' && chatMember.status != 'creator') {
            ctx.reply('You are not admin');
            return;
        }
    }
    catch (errr) {
        ctx.reply('Probably bot not in this channel');
        return;
    }
    UserChat_model_1.UserChat.create({
        chat_id: chatId,
        user_id: userId
    });
    ctx.reply('You successfully save channel');
    return true;
}));
// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.
// Start the bot.
const sequelize = new sequelize_1.Sequelize((_a = process.env.DATABASE_URL) !== null && _a !== void 0 ? _a : '', {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});
sequelize
    .authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
})
    .catch(err => {
    console.error('Unable to connect to the database:', err);
});
bot.start();
