import { Scenes, Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import ConfigService from './config/config.service.js';
import StartCommand from './commands/start.command.js';
import AuthorizationCommand from './commands/authorization.command.js';
import AuthorizationScene from './scenes/authorization.scene.js';

/* ToDo:
  1. При запуске, добавить кнопку авторизации ✔
    1.1. Будет визард для поэтапного ввода логина и пароль
  2. Кнопка для получение/добавление и удаления постов по id
    2.1. Получения постов с пагинацией
    2.2. Удаление поста по id
    2.3. Добавление поста c предпросмотром и сабмитом или отменой
*/
class Bot {
  bot;

  commands;

  configService;

  constructor(configService) {
    this.configService = configService;
    const botToken = this.configService.get('BOT_TOKEN');

    const authorizationScene = new AuthorizationScene().getScene();

    const scenes = new Scenes.Stage([authorizationScene]);
    this.bot = new Telegraf(botToken);
    this.bot.use((new LocalSession({ database: 'tg-session-db.json' })).middleware());
    this.bot.use(scenes.middleware());
  }

  init() {
    this.commands = [
      new StartCommand(this.bot, this.configService),
      new AuthorizationCommand(this.bot, this.configService),
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
