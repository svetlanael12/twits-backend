const { successJson, errorJson } = require('../functions/result');
const Post = require('../model/Post');
const User = require('../model/User')

class postController {
  async getPosts(req, res) {
    try {
      const posts = await Post.find().select('-__v').sort({"date": -1 })
      return res.json(successJson(posts))
    } catch (e) {
      console.log(e)
      return res.status(400).json(errorJson('getPosts error'))
    }
  }

  async getPostID(req, res) {
    const { id } = req.params
    try {
      const post = await Post.findById(id).select('-__v')
      if (post) {
        return res.json(successJson(post))
      } else {
        return res.status(404).json(errorJson('Пост не найден'))
      }
    } catch (e) {
      console.log(e)
      return res.json(errorJson('getPostID error'))
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
      userID: id,
      date: Date.now()
    })
    try {
      await newPost.save()
      let post = newPost.id;
      let result = await User.findByIdAndUpdate(
        id,
        { $push: { "posts": post } },
        { upsert: true, new: true })
        return res.json(successJson(newPost))
    } catch (e) {
      console.log(e)
      return res.status(400).json(errorJson('getPosts error'))
    }
  }

  async updatePost(req, res) {
    const { id } = req.params
    const { title, description } = req.body
    try {
      let result = await Post.findByIdAndUpdate(id, { title, description, date: Date.now() })
      return res.json(successJson(result))
    } catch (e) {
      console.log(e)
      return res.status(400).json(errorJson('getPosts error'))
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
      return res.json(successJson(id))
    } catch (e) {
      console.log(e)
      return res.status(400).json(errorJson('getPosts error'))
    }
  }
}

module.exports = new postController()
