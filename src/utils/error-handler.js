import { logger } from './logger.js';

export function handleApiError(message, error) {
  logger.error(`${message}:`, error);
  
  return {
    content: [
      {
        type: 'text',
        text: `${message}: ${error.message}`
      }
    ]
  };
}
