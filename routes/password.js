const sha1 = require('sha1');
const express = require('express');
const router = express.Router();

const UserModel = require('../models/users');
const checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function (req, res, next) {
  const author = req.session.user._id;
  const name = req.session.user.name;
  UserModel.getUserByName(name)
    .then(function (user) {
      if (!user) {
        throw new Error('用户不存在');
      }
      if (user._id.toString() !== author.toString()) {
        throw new Error('没有权限');
      }

      res.render('password', {
        user: user
      });
    });
});

router.post('/', checkLogin, function (req, res, next) {
  const author = req.session.user._id;
  const name = req.fields.name;
  const password = req.fields.password;

  // 校验参数
  try {
    if (!password.length) {
      throw new Error('密码不为空');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  };

  UserModel.getUserByName(name)
    .then(function (user) {
      if (!user) {
        throw new Error('用户不存在');
      }
      if (user._id.toString() !== author.toString()) {
        throw new Error('没有权限');
      }

      UserModel.changePassword(user._id, { name: name, password: sha1(password) })
        .then(function () {
          req.flash('success', '修改密码成功');
          // 修改密码成功后清空session中用户信息 重新登陆
          req.session.user = null;
          res.redirect('/signin');
        })
        .catch(next);
    });
});

module.exports = router;
