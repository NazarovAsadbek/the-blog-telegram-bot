import { Markup } from 'telegraf';
import { Command } from './comman.class.js';

class StartCommand extends Command {
  constructor(bot, configService) {
    super(bot, configService);
  }

  handle() {
    this.bot.start((ctx) => {
      ctx.reply(
        `🤖 Привествую тебя, ${ctx.from.first_name}!\n`,
        Markup.keyboard([
          ['Авторизоваться'],
        ]).oneTime().resize(),
      );
    });
  }
}

export default StartCommand;
