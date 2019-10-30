const express = require('express');
const postsRouter = require('./posts/posts-router');
const commentsRouter = require('./comments/comments-router');
const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter);
server.use('/api/posts', commentsRouter);

module.exports = server;
