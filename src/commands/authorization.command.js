import { Command } from './comman.class.js';

class AuthorizationCommand extends Command {
  constructor(bot, configService) {
    super(bot, configService);
  }

  handle() {
    this.bot.hears('Авторизоваться', (ctx) => {
      ctx.scene.enter('authorization_scene')
    });
  }
}

export default AuthorizationCommand;
