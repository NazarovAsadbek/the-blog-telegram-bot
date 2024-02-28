import { Scenes } from 'telegraf';

export class ScenesInitializer {
  createWizardScene(sceneName, sceneSteps) {
    if (!sceneName) {
      throw new Error('Не было передано имя сцены');
    }
    if (!Array.isArray(sceneSteps) && sceneSteps?.length === 0) {
      throw new Error('Не были переданы шаги сцены');
    }

    return new Scenes.WizardScene(
      sceneName,
      ...sceneSteps,
    );
  }
}
