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
      this.enterPostTitle.bind(this),
      this.enterPostDescription.bind(this),
      this.enterPostImage.bind(this)
    ];
  }

  setupOnEnterScene() {
    this.scene.enter((ctx) => ctx.reply('Введите назание поста'));
  }

  processError(ctx, error) {
    ctx.scene.state = {};
    ctx.reply(error);
    return ctx.scene.leave();
  }

  buildUserFormData(state) {
    if (!state.postTitle) {
      throw new Error('Поле postTitle не передано');
    }
    if (!state.postDescription) {
      throw new Error('Поле postDescription не передано');
    }

    return {
      user: {
        postTitle: state.postTitle,
        postDescription: state.postDescription,
      },
    };
  }

  enterPostTitle(ctx) {
    try {
      const message = ctx?.message?.text ?? '';
      ctx.scene.state.postTitle = message;

      if (message === '/start') {
        ctx.scene.state.postTitle = null;
        return ctx.scene.leave();
      }

      ctx.reply('Введите описание поста');
      return ctx.wizard.next();
    } catch (e) {
      return this.processError(ctx, 'Упс... Произошла какая-та ошибка');
    }
  }

  async enterPostDescription(ctx) {
    try {
      const message = ctx?.message?.text ?? '';
      ctx.scene.state.postDescription = message;

      if (ctx.scene.state.postTitle === '/start' && ctx.scene.state.postDescription === '/start') {
        ctx.scene.state.postTitle = null;
        ctx.scene.state.postDescription = null;
        return ctx.scene.leave();
      }

      ctx.reply('Введите ссылку фотографии поста');
      return ctx.wizard.next();
    } catch (e) {
      return this.processError(ctx, 'Авторизация провалилась, повторите попытку!');
    }
  }

  async enterPostImage(ctx) {
    try {
      const message = ctx?.message?.text ?? '';
      ctx.scene.state.postImage = message;

      if (ctx.scene.state?.postTitle === '/start' && ctx.scene.state?.postDescription === '/start' && ctx.scene.state?.postImage === '/start') {
        ctx.scene.state.postTitle = null;
        ctx.scene.state.postDescription = null;
        ctx.scene.state.postImage = null;
        return ctx.scene.leave();
      }

      ctx.reply('Preview поста');
      return ctx.wizard.next();
    } catch (e) {
      return this.processError(ctx, 'Авторизация провалилась, повторите попытку!');
    }
  }


  getWizardScene() {
    return this.scene;
  }
}

export default AuthorizationScene;
