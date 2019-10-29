const express = require('express');
const db = require('../data/db');

const router = express.Router();

router.get('/', (req, res) => {
  db.find()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(post => {
      return post
        ? res.status(200).json(post)
        : res.status(404).json({
            message: 'The post with the specified ID does not exist.'
          });
    })
    .catch(() => {
      return res.status(500).json({
        error: 'The post information could not be retrieved.'
      });
    });
});

router.post('/', (req, res) => {
  const newPost = {
    title: req.body.title.trim(),
    contents: req.body.contents.trim()
  };

  if (!newPost.title || !newPost.contents) {
    return res.status(400).json({
      error: 'Please provide title and contents for the post.'
    });
  }

  db.insert(newPost)
    .then(data => {
      return res.status(201).json(data);
    })
    .catch(() => {
      return res.status(500).json({
        error: 'There was an error while saving the post to the database'
      });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(data => {
      return data
        ? res.status(200).json({ id })
        : res.status(404).json({
            message: 'The post with the specified ID does not exist.'
          });
    })
    .catch(() => {
      return res.status(500).json({
        errorMessage: 'The post could not be removed'
      });
    });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;

  const post = {
    title: req.body.title.trim(),
    contents: req.body.contents.trim()
  };

  if (!post.title || !post.contents) {
    return res.status(400).json({
      error: 'Please provide title and contents for the post.'
    });
  }
  db.update(id, post)
    .then(data => {
      return data
        ? res.status(200).json({ id, ...post })
        : res.status(404).json({
            message: 'The post with the specified ID does not exist.'
          });
    })
    .catch(() => {
      return res.status(500).json({
        errorMessage: 'The post information could not be modified.'
      });
    });
});

module.exports = router;
