const Router = require('express');
const passport = require('passport')
const controller = require('../controllers/authController');
 
const router = new Router()
 
router.post('/registration', controller.registration);
router.post('/login', controller.login);
router.get('/user/:id', controller.getUser);
router.get('/check', passport.authenticate('jwt', {session: false}), controller.check);
 
module.exports = router