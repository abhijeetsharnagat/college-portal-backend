const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const newPost = new Post({
      title,
      content,
      user: userId,
    });

    const post = await newPost.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', ['name', 'email']);

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Like a post
exports.likePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post is already liked by the user
    if (post.likes.includes(userId)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.push(userId);
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Comment on a post
exports.commentOnPost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      user: userId,
      text,
    };

    post.comments.push(newComment);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};