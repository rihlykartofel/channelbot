import express from "express";
import { Bot, webhookCallback } from "grammy";
import { Sequelize } from "sequelize";
import { UserChat } from "./database/models/UserChat.model";

const bot = new Bot('5110816886:AAE-xead4hpq_-YBNFig4G4Y9Qef7aen2R4'); // <-- put your authentication token between the ""
const server = express();
bot.api.setWebhook('https://lynchestock.herokuapp.com/');

server.use(express.json());
server.use(webhookCallback(bot, "express"))

server.listen(5000);




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

const sequelize = new Sequelize('postgres://xlszknkpngdwyd:3fc7b93d09ab92b1071763284946b6abd35631fe48e4e1c798bf44502e2ed6ac@ec2-52-18-116-67.eu-west-1.compute.amazonaws.com:5432/desvn1k68e4r1v', {
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

