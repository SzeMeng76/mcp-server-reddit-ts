#!/usr/bin/env node

const { start } = require('../src/server.js');

// 处理命令行参数等
start().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
