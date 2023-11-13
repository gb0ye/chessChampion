const { query } = require("express");
const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
   const replyKeyboard = Markup.inlineKeyboard([
      //   Markup.button.userRequest("Select player player"),
      Markup.button.switchToChat("Select Player", ""),
   ]);

   const info = await ctx.reply(
      "Hi please select user you want to play with",
      replyKeyboard
   );
   console.log(info);
});

bot.on("inline_query", async (ctx) => {
   const userInfo = ctx.update.inline_query.from;

   const results = [
      {
         type: "article",
         id: "1",
         title: "Default Game",
         input_message_content: {
            message_text: `Creating game session.\n\n please wait a moment... `,
         },
         reply_markup: {
            inline_keyboard: [
               [Markup.button.callback("wait ...", "yhhh")],
            ],
         },
         thumbnail_url:
            "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=1558&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
         description: "Default and only game available to play for now. More options to come !!!",
      },
   ];

   await ctx.answerInlineQuery(results, {
      button: {
         web_app: {
            url: process.env.BOT_WEBAPP_URL,
         },
         text: "Chess site",
      },
      cache_time: 0,
   });
});

bot.on("chosen_inline_result", async (ctx) => {
   console.log(ctx);
   const tgUser = ctx.update.chosen_inline_result.from;
   const messageId = ctx.update.chosen_inline_result.inline_message_id;
   const messageText = "Game Session Created! \n\n Please click the 'join' button to join game";
   const keyboard = Markup.button.url(
      "Join",
      "https://t.me/gb0yeChessBot/CHESS"
   );

   await bot.telegram.editMessageText(
      undefined,
      undefined,
      messageId,
      messageText,
      {
         parse_mode: "Markdown",
         reply_markup: {
            inline_keyboard: [[keyboard]],
         },
      }
   );
});

module.exports = { bot };
