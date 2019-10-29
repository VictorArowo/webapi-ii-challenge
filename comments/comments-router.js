const express = require('express');
const db = require('../data/db');
const redis = require('redis');

const client = redis.createClient(6379);

const router = express.Router();

client.on('error', err => {
  console.log('Error ' + err);
});

client.on('connect', function() {
  console.log('Redis client connected');
});

router.get('/:id/comments', (req, res) => {
  const { id } = req.params;

  const postRedisKey = 'posts';

  return client.get(postRedisKey, (err, posts) => {
    if (posts) {
      return res.status(200).json({ source: 'cache', data: JSON.parse(posts) });
    } else {
      db.findPostComments(id)
        .then(data => {
          client.setex(postRedisKey, 10, JSON.stringify(data));

          return data.length
            ? res.status(200).json({ ...data, source: 'api' })
            : res.status(404).json({
                message: 'The post with the specified ID does not exist.'
              });
        })
        .catch(() => {
          return res.status(500).json({
            error: 'The comments information could not be retrieved.'
          });
        });
    }
  });
});

router.post('/:id/comments', (req, res) => {
  const { id } = req.params;

  const newComment = {
    text: req.body.text.trim(),
    post_id: id
  };

  if (!newComment.text) {
    return res.status(400).json({
      error: 'Please provide text for the comment.'
    });
  }

  db.insertComment(newComment)
    .then(data => {
      console.log(data);
      return data
        ? res.status(200).json(data)
        : res.status(404).json({
            message: 'The post with the specified ID does not exist.'
          });
    })
    .catch(() => {
      return res.status(500).json({
        error: 'There was an error while saving the comment to the database'
      });
    });
});

module.exports = router;
