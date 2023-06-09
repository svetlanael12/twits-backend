const Router = require('express');
const passport = require('passport')
const controller = require('../controllers/postController');
 
const router = new Router()
 
router.get('/', controller.getPosts);
router.get('/:id', controller.getPostID)

// headers: {'Authorization': 'Bearer token' }
router.post('/create', passport.authenticate('jwt', {session: false}), controller.createPost)
router.put('/:id', passport.authenticate('jwt', {session: false}), controller.updatePost)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.deletePost)

module.exports = router
