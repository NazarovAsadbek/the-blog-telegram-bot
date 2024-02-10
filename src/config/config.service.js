import { config } from 'dotenv';

class ConfigService {
  config;

  constructor() {
    const { error, parsed } = config();

    if (error) {
      throw new Error('ConfigService: Error parsing .env file');
    }

    if (!parsed) {
      throw new Error('ConfigService: Error parsing .env file');
    }

    this.config = parsed;
  }

  get(key) {
    const res = this.config[key];

    if (!res) {
      throw new Error(`ConfigService: Key ${key} not found`);
    }

    return res;
  }
}

export default ConfigService;
