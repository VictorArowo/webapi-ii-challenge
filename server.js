const express = require('express');
const router = require('./posts/posts-router');
const server = express();

server.use(express.json());

server.use('/api/posts', router);

module.exports = server;
