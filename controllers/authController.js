const bcrypt = require('bcrypt');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

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
      if (!email || !password || email.length === 0 || username === 0 || !username || password.length === 0) {
        return res.json({ status: 'error', message: 'Поля email, пароль и имя не могут быть пустыми' })
      }
      if (password.length < 5) {
        return res.json({ status: 'error', message: 'Пароль не должен быть меньше 5 символов' })
      }
      const candidate = await User.findOne({ email })
      if (candidate) {
        return res.json({ status: 'error', message: 'Пользователь с таким email уже существует' })
      }
      const candidateUsername = await User.findOne({ username })
      if (candidateUsername) {
        return res.json({ status: 'error', message: 'Пользователь с таким именем уже существует' })
      }
      const hashPassword = bcrypt.hashSync(password, 10);
      const user = new User({ email, password: hashPassword, username })
      await user.save();
      return res.json({ status: 'error', body: user })
    } catch (e) {
      console.log(e)
      res.status(400).json({ status: 'error', message: 'Registration error' })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        return res.json({ status: 'error', message: 'Пользователь с таким email не найден' })
      }
      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.json({ status: 'error', message: 'Неверный пароль' })
      }
      const token = generateAccessToken(user.userId, user.email, user.username);
      return res.json({ status: 'succes', body: token })
    } catch (e) {
      console.log(e)
      res.status(400).json({ status: 'error', message: 'Login error' })
    }
  }

}

module.exports = new authController()
