import { config } from '../config.js';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = levels[config.logging.level] || levels.info;

export const logger = {
  error: (message, ...args) => {
    if (currentLevel >= levels.error) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  warn: (message, ...args) => {
    if (currentLevel >= levels.warn) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  info: (message, ...args) => {
    if (currentLevel >= levels.info) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  debug: (message, ...args) => {
    if (currentLevel >= levels.debug) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};
