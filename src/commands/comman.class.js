export class Command {
  bot;

  configService;

  constructor(bot, configService) {
    this.bot = bot;
    this.configService = configService;
  }

  handle(ctx) {
  }
}
