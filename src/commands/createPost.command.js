import { Command } from './comman.class.js';
import createPostScene from "../scenes/createPost.scene.js";

class CreatePostCommand extends Command {
    constructor(bot, configService) {
        super(bot, configService);
    }

    handle() {
        this.bot.hears('Создать пост 🆕', (ctx) => {
            ctx.scene.enter("create_post_scene");
        });
    }
}

export default CreatePostCommand;
