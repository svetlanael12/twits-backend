const bcrypt = require('bcrypt');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { errorJson, successJson } = require('../functions/result');

const generateAccessToken = (id, email, username) => {
  const payload = {
    userId: id,
    email: email,
    username: username
  }
  return jwt.sign(payload, 'Secret-key', { expiresIn: "24h" })
}

class authController {
  async registration(req, res, next) {
    try {
      const { email, password, username } = req.body;
      if (!email || email.length === 0) {
        return res.json(errorJson('email', 'Email не может быть пустыми'))
      }
      if (!password || password.length === 0) {
        return res.json(errorJson('password', 'Пароль не может быть пустыми'))
      }
      if ( username === 0 || !username ) {
        return res.json(errorJson('username', 'Имя не может быть пустыми'))
      }
      if (password.length < 5) {
        return res.json(errorJson('password', 'Пароль не должен быть меньше 5 символов'))
      }
      const candidate = await User.findOne({ email })
      if (candidate) {
        return res.json(errorJson('email', 'Пользователь с таким email уже существует'))
      }
      const candidateUsername = await User.findOne({ username })
      if (candidateUsername) {
        return res.json(errorJson('username', 'Пользователь с таким именем уже существует'))
      }
      const hashPassword = bcrypt.hashSync(password, 10);
      const user = new User({ email, password: hashPassword, username })
      await user.save();
      return res.json(successJson(user))
    } catch (e) {
      console.log(e)
      return res.status(400).json(errorJson('Registration error'))
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        return res.json(errorJson('email', 'Пользователь с таким email не найден'))
      }
      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.json(errorJson('password', 'Неверный пароль'))
      }
      const token = generateAccessToken(user.id, user.email, user.username);
      return res.json(successJson(token))
    } catch (e) {
      console.log(e)
      return res.json(errorJson('Login error'))
    }
  }

  async getUser(req, res) {
    try {
      console.log(req.params)
      const { id } = req.params
      const user = await User.findById(id).select('-password')
      if (!user) {
        return res.json(errorJson('userId', 'Пользователь не найден'))
      }
      return res.json(successJson(user))
    } catch (e) {
      console.log(e)
      return res.json(errorJson('getUser'))
    }
  }

  async check(req, res) {
    const { user } = req
    try {
      const token = generateAccessToken(user.id, user.email, user.username);
      return res.json(successJson(token))
    } catch (e) {
      console.log(e)
      return res.json(errorJson('check error'))
    }
  }
}

module.exports = new authController()
