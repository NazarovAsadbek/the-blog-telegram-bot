import axios from 'axios';
import ConfigService from '../config/config.service.js';
import { ScenesInitializer } from './comman.class.js';

class AuthorizationScene extends ScenesInitializer {
  constructor() {
    super();
    this.configService = new ConfigService();
    this.url = this.configService.get('API_URL');
    this.sceneSteps = this.buildSceneSteps();
    this.scene = this.createWizardScene('authorization_scene', this.sceneSteps);
    this.setupOnEnterScene();
  }

  buildSceneSteps() {
    return [
      this.gettingStartedBotStep.bind(this),
      this.authorizationStep.bind(this),
    ];
  }

  setupOnEnterScene() {
    this.scene.enter((ctx) => ctx.reply('Введите логин'));
  }

  processError(ctx, error) {
    ctx.scene.state = {};
    ctx.reply(error);
    return ctx.scene.leave();
  }

  buildUserFormData(state) {
    if (!state.username) {
      throw new Error('Поле username не передано');
    }
    if (!state.password) {
      throw new Error('Поле password не передано');
    }

    return {
      user: {
        username: state.username,
        email: `test${new Date().getTime()}@mail.ru`,
        password: state.password,
      },
    };
  }

  gettingStartedBotStep(ctx) {
    try {
      const message = ctx?.message?.text ?? '';
      ctx.scene.state.username = message;

      if (message === '/start') {
        ctx.scene.state.username = null;
        return ctx.scene.leave();
      }
      ctx.reply('Введите пароль');
      return ctx.wizard.next();
    } catch (e) {
      return this.processError(ctx, 'Упс... Произошла какая-та ошибка');
    }
  }

  async authorizationStep(ctx) {
    try {
      const message = ctx?.message?.text ?? '';
      ctx.scene.state.password = message;

      if (ctx.scene.state.username === '/start' && ctx.scene.state.password === '/start') {
        ctx.scene.state.username = null;
        ctx.scene.state.password = null;
        return ctx.scene.leave();
      }

      const formData = this.buildUserFormData(ctx.scene.state);
      const response = await axios.post(`${this.url}/users`, formData);
      if (response.status < 400) {
        ctx.reply('Вы успешно авторизировались!');
      }
      return ctx.scene.leave();
    } catch (e) {
      return this.processError(ctx, 'Упс... Произошла какая-та ошибка');
    }
  }

  getWizardScene() {
    return this.scene;
  }
}

export default AuthorizationScene;
