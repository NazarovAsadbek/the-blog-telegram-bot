import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import ConfigService from './config/config.service.js';
import StartCommand from './commands/start.command.js';

class Bot {
  bot;

  commands;

  configService;

  constructor(configService) {
    this.configService = configService;
    const botToken = this.configService.get('BOT_TOKEN');
    this.bot = new Telegraf(botToken);
    this.bot.use((new LocalSession({ database: 'tg-session-db.json' })).middleware());
  }

  init() {
    this.commands = [
      new StartCommand(this.bot, this.configService),
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const command of this.commands) {
      command.handle();
    }

    this.bot.launch();
  }
}

const bot = new Bot(new ConfigService());
bot.init();
