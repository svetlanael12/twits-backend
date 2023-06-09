const Post = require('../model/Post');
const User = require('../model/User')

class postController {
  async getPosts(req, res) {
    try {
      const posts = await Post.find().select('-__v')
      res.json({ status: 'success', body: posts })
    } catch (e) {
      console.log(e)
      res.status(400).json({ status: 'error', message: 'getPosts error' })
    }
  }

  async getPostID(req, res) {
    const { id } = req.params
    try {
      const post = await Post.findById(id).select('-__v')
      if (post) {
        res.json({ status: 'success', body: post })
      } else {
        res.status(404).json({ status: 404, message: 'Пост не найден' })
      }
    } catch (e) {
      console.log(e)
      res.status(400).json({ status: 'error', message: 'getPostID error' })
    }
  }

  async createPost(req, res) {
    const { title, description } = req.body
    const { id, username } = req.user
    console.log(id)

    const newPost = new Post({
      title,
      description,
      username,
      id
    })
    try {
      await newPost.save()
      let post = newPost.id;
      let result = await User.findByIdAndUpdate(
        id,
        { $push: { "posts": post } },
        { upsert: true, new: true })
      res.json({ status: 'success', body: newPost })
    } catch (e) {
      console.log(e)
      res.status(400).json({ status: 'error', message: 'getPosts error' })
    }
  }

  async updatePost(req, res) {
    const { id } = req.params
    const { title, description } = req.body
    try {
      let result = await Post.findByIdAndUpdate(id, { title, description })
      res.json({ status: 'success', body: result })
    } catch (e) {
      console.log(e)
      res.status(400).json({ status: 'error', message: 'getPosts error' })
    }
  }

  async deletePost(req, res) {
    const { id } = req.params
    try {
      await Post.deleteOne({ _id: id })
      let result = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { "posts": id } }
      )
      res.json({ status: 'success', body: 'Успешно удалено' })
    } catch (e) {
      console.log(e)
      res.status(400).json({ status: 'error', message: 'getPosts error' })
    }
  }
}

module.exports = new postController()
