import { Bot } from "grammy";
import { Sequelize } from "sequelize";
import { UserChat } from "./database/models/UserChat";

// Create an instance of the `Bot` class and pass your authentication token to it.
const bot = new Bot("5110816886:AAF8wLylhLQpyVPZxjKE6Hm8frrj4lZwNVg"); // <-- put your authentication token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
// bot.on("message", (ctx) => ctx.reply("Got another message!"));

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
    const chatId = ctx.chat.id;

    if (!userId) {
        ctx.reply('Wrong author');
        return;
    }

    const chatMember = await ctx.api.getChatMember(chatId, userId);

    if (chatMember.status !== 'administrator' && chatMember.status !== 'creator') {
        ctx.reply('You are not admin');
        return;
    }

    UserChat.create({
        chat_id: ctx.chat.id,
        user_id: userId
    });

    ctx.reply('You successfully save channel');

    return true;

});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.

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

bot.start();