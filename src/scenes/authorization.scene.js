import { Scenes } from 'telegraf';

class AuthorizationScene {
  constructor() {
    // const sceneSteps = []
    this.sceneSteps = [
      this.firstStep.bind(this),
    ];

    // const scene = []
    this.scene = new Scenes.WizardScene(
      'authorization_scene',
      ...this.sceneSteps,
    );

    this.scene.enter((ctx) => ctx.reply('Введите логин 123213213213'));
  }

  async firstStep(ctx) {
    try {
      const message = ctx?.message?.text ?? '';
      if (message === '/start') {
        await ctx.scene.leave();
        await ctx.scene.enter('authorization_scene');
      } else {
        ctx.reply('Введите пароль');
        await ctx.scene.leave();
      }
    } catch (e) {
      ctx.reply('Упс... Произошла какая-та ошибка');
      console.error(e);
    }
  }

  getScene() {
    return this.scene;
  }
}

export default AuthorizationScene;
