import { Scenes } from 'telegraf';
import axios from 'axios';

class AuthorizationScene {
  constructor() {
    // const sceneSteps = []
    this.sceneSteps = [
      this.firstStep.bind(this),
      this.secondStep.bind(this),
    ];

    // const scene = []
    this.scene = new Scenes.WizardScene(
      'authorization_scene',
      ...this.sceneSteps,
    );

    this.scene.enter((ctx) => ctx.reply('Введите логин'));
  }

  async firstStep(ctx) {
    try {
      const message = ctx?.message?.text ?? '';
      ctx.scene.state.username = message;

      if (message === '/start') {
        ctx.scene.state.username = null;
        await ctx.scene.leave();
      }
      ctx.reply('Введите пароль');
      return ctx.wizard.next();
    } catch (e) {
      ctx.scene.state = {};
      ctx.reply('Упс... Произошла какая-та ошибка');
      await ctx.scene.leave();
      return null;
    }
  }

  async secondStep(ctx) {
    try {
      const message = ctx?.message?.text ?? '';
      ctx.scene.state.password = message;
      if (ctx.scene.state.username !== '/start' && ctx.scene.state.password !== '/start') {
        const formData = {
          user: {
            username: ctx.scene.state.username,
            email: `test${new Date().getTime()}@mail.ru`,
            password: ctx.scene.state.password,
          },
        };
        const res = await axios.post('http://155.133.23.97:3003/users', formData);
        if (res.status < 400) {
          ctx.reply('Вы успешно авторизировались!');
        }
        await ctx.scene.leave();
      }
    } catch (e) {
      ctx.scene.state = {};
      ctx.reply('Упс... Произошла какая-та ошибка');
      await ctx.scene.leave();
    }
  }

  getScene() {
    return this.scene;
  }
}

export default AuthorizationScene;
