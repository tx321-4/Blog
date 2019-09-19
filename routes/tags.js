const express = require('express');
const router = express.Router();
const PostModel = require('../models/posts');

const checkLogin = require('../middlewares/check').checkLogin;

router.get('/:tag', checkLogin, function (req, res, next) {
  const author = req.query.author;
  const tag = req.params.tag;

  PostModel.getPoststag(author, tag)
    .then(function (posts) {
      res.render('tags', {
        posts: posts
      });
    }).catch(next);

  // res.send(tag);
});

module.exports = router;
