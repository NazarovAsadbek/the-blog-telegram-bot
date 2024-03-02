import axios from 'axios';
import { Markup } from 'telegraf';
import ConfigService from '../config/config.service.js';
import { ScenesInitializer } from './comman.class.js';

/* ToDo:
  1.Обработка пост Title - а
  2.Обработка пост Description - а
  3.Обработка Img(Body)
  4.Предпросмотр поста
  5.Заливка на сервак.
*/

class AuthorizationScene extends ScenesInitializer {
  constructor() {
    super();
    this.configService = new ConfigService();
    this.url = this.configService.get('API_URL');
    this.sceneSteps = this.buildSceneSteps();
    this.scene = this.createWizardScene('create_post_scene', this.sceneSteps);
    this.setupOnEnterScene();
  }

  buildSceneSteps() {
    return [
      this.gettingStartedBotStep.bind(this),
      this.authorizationStep.bind(this),
    ];
  }

  setupOnEnterScene() {
    this.scene.enter((ctx) => ctx.reply('Создайте пост'));
  }

  processError(ctx, error) {
    ctx.scene.state = {};
    ctx.reply(error);
    return ctx.scene.leave();
  }

  buildUserFormData(state) {
    if (!state.email) {
      throw new Error('Поле email не передано');
    }
    if (!state.password) {
      throw new Error('Поле password не передано');
    }

    return {
      user: {
        email: state.email,
        password: state.password,
      },
    };
  }

  gettingStartedBotStep(ctx) {
    try {
      const message = ctx?.message?.text ?? '';
      ctx.scene.state.email = message;

      if (message === '/start') {
        ctx.scene.state.email = null;
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

      if (ctx.scene.state.email === '/start' && ctx.scene.state.password === '/start') {
        ctx.scene.state.email = null;
        ctx.scene.state.password = null;
        return ctx.scene.leave();
      }

      const formData = this.buildUserFormData(ctx.scene.state);
      const response = await axios.post(`${this.url}/users/login`, formData);
      if (response.status >= 400) {
        return this.processError(ctx, 'Авторизация провалилась, повторите попытку!');
      }

      if (response?.data?.user?.token) {
        ctx.scene.state.token = response?.data?.user?.token;
        ctx.reply(
          'Вы успешно авторизировались!',
          Markup.keyboard([
            ['Получить все посты 📜', 'Получить пост по id 🔡'], // Первый ряд с двумя кнопками
            ['Обновить пост 🆙', 'Создать пост 🆕'], // Второй ряд с двумя кнопками
            ['Удалить пост ❌'], // Третий ряд с одной кнопкой
          ]).resize(),
        );
      }
      return ctx.scene.leave();
    } catch (e) {
      return this.processError(ctx, 'Авторизация провалилась, повторите попытку!');
    }
  }

  getWizardScene() {
    return this.scene;
  }
}

export default AuthorizationScene;
