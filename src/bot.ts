import express from "express";
import { Bot, webhookCallback } from "grammy";
import { Sequelize } from "sequelize";
import { UserChat } from "./database/models/UserChat.model";

const bot = new Bot(process.env.TOKEN!); // <-- put your authentication token between the ""
const server = express();
bot.api.setWebhook('https://lynchestock.herokuapp.com/');

server.use(express.json());
server.use(webhookCallback(bot, "express"))

server.listen(process.env.PORT);




bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

bot.command("add_channel", async (ctx) => {

    const chatNickname = ctx.message?.text.split(' ', 2)[1];

    if (!chatNickname) {
        ctx.reply('Wrong channel name');
        return;
    }

    if (!(/^@[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*$/.test(chatNickname))) {
        ctx.reply('Wrong channel name');
        return;
    }

    const chat = await ctx.api.getChat(chatNickname);

    if (chat.type != 'channel') {
        ctx.reply('Wrong channel type');
        return;
    }

    const userId = ctx.from?.id;
    const chatId = chat.id;

    if (!userId) {
        ctx.reply('Wrong author');
        return;
    }


    let chatMember;
    try {
        chatMember = await ctx.api.getChatMember(chat.id, userId);

        if (chatMember.status != 'administrator' && chatMember.status != 'creator') {
            ctx.reply('You are not admin');
            return;
        }
    } catch (errr) {
        ctx.reply('Probably bot not in this channel');
        return;
    }

    UserChat.create({
        chat_id: chatId,
        user_id: userId
    });

    ctx.reply('You successfully save channel');



    return true;

});

const sequelize = new Sequelize(process.env.DATABASE_URL ?? '', {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}
);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

