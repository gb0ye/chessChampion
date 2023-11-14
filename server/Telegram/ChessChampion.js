const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();

class chessChampion {
   constructor(gameServer) {
      this.gameServer = gameServer;

      this.token = process.env.BOT_TOKEN;

      this.bot = new Telegraf(this.token);

      this.WebAppCustomizeUrl = process.env.WEBAPP_CUSTOMIZED_URL;

      this.bot.command("start", this.handleStartCommand);
      this.bot.on("inline_query", this.handleInlineQuery);
      this.bot.on("chosen_inline_result", this.handleInlineResult);
   }

   handleStartCommand = async (ctx, update_id) => {
      const tgUser = ctx.update.message.from;

      const replyKeyboard = Markup.inlineKeyboard([
         Markup.button.switchToChat("Select Player", ""),
      ]);

      await ctx.reply(
         "Hi, this is a chess bot created by @gb0ye a student of covenant university.\n\nPlease select the user you would like to play with",
         replyKeyboard
      );

      console.log(this.gameServer.rooms)
   };

   handleInlineQuery = async (ctx) => {
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
               inline_keyboard: [[Markup.button.callback("wait ...", "yhhh")]],
            },
            thumbnail_url:
               "https://images.unsplash.com/photo-1586165368502-1bad197a6461?q=80&w=1558&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description:
               "Default and only game available to play for now. More options to come !!!",
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


   };

   handleInlineResult = async (ctx) => {
      const roomCreated = await this.gameServer.createRoom();

      const tgUser = ctx.update.chosen_inline_result.from;
      const messageId = ctx.update.chosen_inline_result.inline_message_id;
      const messageText =
      "Game Session Created! \n\n Please click the 'join' button to join game";
      const keyboard = Markup.button.url(
         "Join",
         `https://t.me/gb0yeChessBot/CHESS?startapp=${roomCreated.roomId}`
         );
         
         await this.bot.telegram.editMessageText(
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
   };

   lanuch = () => {
      this.bot.launch();
   };
}
module.exports = { chessChampion };
