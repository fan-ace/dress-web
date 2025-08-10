import * as fs from 'fs';
import * as path from 'path';

export class ConfigManager {
  private static envConfig: Record<string, any> = {};
  private static jsonConfig: Record<string, any> = {};

  static loadEnv(envPath: string = '.env') {
    const envFile = fs.readFileSync(path.resolve(envPath), 'utf-8');
    envFile.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        ConfigManager.envConfig[key.trim()] = value.trim();
      }
    });
  }

  static loadJson(jsonPath: string) {
    const jsonData = fs.readFileSync(path.resolve(jsonPath), 'utf-8');
    ConfigManager.jsonConfig = { ...ConfigManager.jsonConfig, ...JSON.parse(jsonData) };
  }

  // source: 'env' | 'json' | undefined (undefined: ưu tiên json, rồi đến env)
  static get(key: string, source?: 'env' | 'json'): any {
    if (source === 'env') return ConfigManager.envConfig[key];
    if (source === 'json') return ConfigManager.jsonConfig[key];
    // Ưu tiên json, rồi đến env
    return ConfigManager.jsonConfig[key] ?? ConfigManager.envConfig[key];
  }
}

/* How to use:
ConfigManager.loadEnv();
ConfigManager.loadJson('config.json');

const apiUrlFromEnv = ConfigManager.get('API_URL', 'env');
const apiUrlFromJson = ConfigManager.get('API_URL', 'json');
const apiUrlDefault = ConfigManager.get('API_URL'); // Ưu tiên json, rồi đến env do loadJson call sau
 */